import { useEffect, useMemo, useState } from "react";
import { Button, Result, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { width, myApi } from "../../resources/service";
import SearchPage from "./SearchPage";
import BookingWizard from "../../components/search/BookingWizard";

interface DriverDto { telephone: string; name: string; }
interface Booking {
    telephone: string;
    category_id: number;
    start: Dayjs | null;
    end: Dayjs | null;
    drivers: DriverDto[];
    price: number;
    startLocation: string;
    endLocation: string;
}

function AddBooking() {
    const [booking, setBooking] = useState<Booking>();
    const [confirming, setConfirming] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [sp] = useSearchParams();

    // --- find "/book" in the path (works with language prefixes) ---
    const parts = useMemo(() => pathname.replace(/\/+$/, "").split("/"), [pathname]);
    const bookIdx = useMemo(() => parts.indexOf("book"), [parts]);
    const basePrefix = useMemo(() => (bookIdx > 0 ? parts.slice(0, bookIdx).join("/") : ""), [parts, bookIdx]);

    // --- route step detection (incl. /payment/success and /payment/retry) ---
    const routeStep: "search" | "extra" | "info" | "payment" | "done" = useMemo(() => {
        if (bookIdx === -1) return "search";
        const after = parts.slice(bookIdx + 1);
        if (after[0] === "search") return "search";
        if (after[0] === "done") return "done";

        if (after.length >= 2) {
            const step = after[1];
            if (step === "extra" || step === "info") return step;

            if (step === "payment") {
                if (after[2] === "success") return "done";
                if (after[2] === "retry") return "payment";
                return "payment";
            }
        }
        return "search";
    }, [parts, bookIdx]);

    // stripe-success detection (to confirm the booking)
    const isStripeSuccess = useMemo(() => {
        if (bookIdx === -1) return false;
        const after = parts.slice(bookIdx + 1);
        return after[1] === "payment" && after[2] === "success";
    }, [parts, bookIdx]);

    const categoryId = useMemo(() => {
        if (bookIdx === -1) return undefined;
        const maybe = Number(parts[bookIdx + 1]);
        return Number.isFinite(maybe) ? maybe : undefined;
    }, [parts, bookIdx]);

    // keep common labels from URL across refresh
    const startIso = sp.get("start");
    const endIso = sp.get("end");
    const sl = sp.get("sl") || "";
    const dl = sp.get("dl") || "";

    // if user reloads on addons/info/payment, rebuild minimal booking from URL
    useEffect(() => {
        if (!booking && categoryId && startIso && endIso) {
            setBooking({
                category_id: categoryId,
                start: dayjs(startIso),
                end: dayjs(endIso),
                price: 0,
                startLocation: sl,
                endLocation: dl,
                telephone: "",
                drivers: [],
            });
        }
    }, [booking, categoryId, startIso, endIso, sl, dl]);

    const isMobile = width >= 3.38;

    const pickupLabel =
        booking && booking.start
            ? `${booking.startLocation || ""}, ${dayjs(booking.start).format("DD/MM/YYYY HH:mm")}`
            : "";
    const dropoffLabel =
        booking && booking.end
            ? `${booking.endLocation || ""}, ${dayjs(booking.end).format("DD/MM/YYYY HH:mm")}`
            : "";

    // Helpers to keep params on navigation between wizard steps
    const qp = sp.toString();
    const goto = (next: "extra" | "info" | "payment" | "done") => {
        if (!categoryId) return;
        const prefix = basePrefix || "";
        if (next === "done") navigate(`${prefix}/book/done`);
        else navigate(`${prefix}/book/${categoryId}/${next}?${qp}`);
    };

    // --- on Stripe success: confirm the booking in backend using ONLY booking id ---
    const prefix = basePrefix || "";
    const bid = sp.get("bid"); // booking id created before payment

    useEffect(() => {
        const shouldConfirm = isStripeSuccess && !!bid && !confirmed && !confirming;
        if (!shouldConfirm) return;

        (async () => {
            try {
                setConfirming(true);
                await myApi.post(`booking/${bid}/confirm-payment`, {}); // <- no session id
                setConfirmed(true);
                message.success("Η πληρωμή επιβεβαιώθηκε.");
            } catch (e) {
                console.log(e)
                message.error("Δεν ήταν δυνατή η επιβεβαίωση πληρωμής. Επικοινωνήστε μαζί μας.");
            } finally {
                setConfirming(false);
            }
        })();
    }, [isStripeSuccess, bid, confirmed, confirming]);

    const detailsHref = bid
        ? `${prefix}/book/details/${bid}`
        : `${prefix}/book/details${qp ? `?${qp}` : ""}`;

    return (
        <div style={{ padding: isMobile ? "0px" : "20px" }}>
            {routeStep === "search" && <SearchPage onSubmit={onCategorySelect} />}

            {routeStep !== "search" && routeStep !== "done" && booking && (
                <BookingWizard
                    routeStep={routeStep}
                    goto={goto}
                    baseTotal={booking.price ?? 0}
                    currency="EUR"
                    vehicleName={undefined}
                    vehicleImage={undefined}
                    pickupLabel={pickupLabel}
                    dropoffLabel={dropoffLabel}
                />
            )}

            {routeStep === "done" && (
                <Result
                    status="success"
                    title="Η κράτηση σας καταχωρήθηκε επιτυχως!"
                    subTitle="Προσεχώς Θα σας αποσταλεί ανάλογο email με όλες τις πληροφορίες της κράτησής σας καθώς και την απόδειξη της πληρωμής."
                    extra={[
                        <Button type="primary" key="details" onClick={() => navigate(detailsHref)}>
                            Προβολή λεπτομερειών κράτησης
                        </Button>,
                        <Button key="home" onClick={() => navigate("/")} icon={<HomeOutlined />}>
                            Μετάβαση στην αρχικη
                        </Button>,
                    ]}
                />
            )}
        </div>
    );

    function onCategorySelect(partial: Partial<Booking>) {
        setBooking((prev) => ({
            category_id: partial.category_id ?? prev?.category_id ?? 0,
            start: partial.start ?? prev?.start ?? null,
            end: partial.end ?? prev?.end ?? null,
            price: partial.price ?? prev?.price ?? 0,
            startLocation: partial.startLocation ?? prev?.startLocation ?? "",
            endLocation: partial.endLocation ?? prev?.endLocation ?? "",
            telephone: prev?.telephone ?? "",
            drivers: prev?.drivers ?? [],
        }));
    }
}

export default AddBooking;
