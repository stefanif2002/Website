import { useEffect, useMemo, useState } from "react";
import { Button, message, Result } from "antd";
import { HomeOutlined, ProfileOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { myApi, width } from "../../resources/service";
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
interface ChecklistEntryDto { item: string; quantity: number; }

function AddBooking() {
    const [isItFinished, setIsItFinished] = useState(false);
    const [booking, setBooking] = useState<Booking>();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [sp] = useSearchParams();

    // --- find "/book" in the path (works with language prefixes) ---
    const parts = useMemo(() => pathname.replace(/\/+$/, "").split("/"), [pathname]); // ["", "el", "book", "123", "extra"]
    const bookIdx = useMemo(() => parts.indexOf("book"), [parts]);
    const basePrefix = useMemo(() => (bookIdx > 0 ? parts.slice(0, bookIdx).join("/") : ""), [parts, bookIdx]); // "" or "/el"

    // --- route step detection (now handles /payment/success and /payment/retry) ---
    const routeStep: "search" | "extra" | "info" | "payment" | "done" = useMemo(() => {
        if (bookIdx === -1) return "search";
        const after = parts.slice(bookIdx + 1); // ["search"] or [":id","extra"] or [":id","payment","success"]
        if (after[0] === "search") return "search";
        if (after[0] === "done") return "done";

        if (after.length >= 2) {
            const step = after[1];
            if (step === "extra" || step === "info") return step;

            if (step === "payment") {
                // treat ".../payment/success" as final success screen
                if (after[2] === "success") return "done";
                // treat ".../payment/retry" as coming back to the payment step
                if (after[2] === "retry") return "payment";
                return "payment";
            }
        }
        return "search";
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

    const onChooseUser = (
        user: string,
        drivers: DriverDto[],
        flight: string,
        number_of_people: number,
        price: number,
        is_advance_paid: boolean,
        notes: string,
        checklist: ChecklistEntryDto[]
    ) => {
        if (!booking) return;

        const payload = {
            telephone: user,
            category_id: booking.category_id,
            start: booking.start?.toISOString?.() ?? null,
            end: booking.end?.toISOString?.() ?? null,
            drivers,
            price,
            startLocation: booking.startLocation,
            endLocation: booking.endLocation,
            externalCar: false,
            number_of_people,
            flight,
            advance_paid: is_advance_paid,
            notes,
            checklist,
        };

        myApi
            .post(`booking/createAdmin`, payload)
            .then(() => {
                setIsItFinished(true);
                const prefix = basePrefix || "";
                navigate(`${prefix}/book/done`);
            })
            .catch((error) => {
                console.error("Error creating booking:", error);
                message.error("Failed to create booking, ensure the user exists and try again");
            });
    };

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

    // --- build details destination for the success screen ---
    const prefix = basePrefix || "";
    const bid = sp.get("bid"); // if you later append ?bid=... on success
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
                    onSubmit={onChooseUser}
                    baseTotal={booking.price ?? 0}
                    currency="EUR"
                    vehicleName={undefined}
                    vehicleImage={undefined}
                    pickupLabel={pickupLabel}
                    dropoffLabel={dropoffLabel}
                    categoryId={booking.category_id}
                    startIso={booking.start?.toISOString?.() ?? null}
                    endIso={booking.end?.toISOString?.() ?? null}
                    startLocation={booking.startLocation}
                    endLocation={booking.endLocation}
                />
            )}

            {routeStep === "done" && (
                <Result
                    status="success"
                    title="Η κράτηση σας καταχωριθηκε επιτυχως!"
                    subTitle="Προσεχώς Θα σας αποσταλεί ανάλογο email με όλες τις πληροφορίες της κράτησής σας καθώς και την απόδειξη της πληρωμής."
                    extra={[
                        <Button
                            key="home"
                            onClick={() => navigate("/")}
                            icon={<HomeOutlined />}
                        >
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
        // navigation is handled inside SearchPage (keeps params)
    }
}

export default AddBooking;
