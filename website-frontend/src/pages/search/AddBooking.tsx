import { useEffect, useState } from "react";
import { Button, message, Result, Steps } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { myApi, width } from "../../resources/service.ts";
import SearchPage from "./SearchPage.tsx";
import BookingWizard from "../../components/search/BookingWizard.tsx";

interface DriverDto {
    telephone: string;
    name: string;
}

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

interface ChecklistEntryDto {
    item: string;
    quantity: number;
}

function AddBooking() {
    const [isItFinished, setIsItFinished] = useState(false);
    const [booking, setBooking] = useState<Booking>();
    const [stepStatus, setStepStatus] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {}, [isItFinished]);

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
            .then(() => setIsItFinished(true))
            .catch((error) => {
                console.error("Error creating booking:", error);
                message.error("Failed to create booking, ensure the user exists and try again");
            });
    };

    const onPrevious = () => setStepStatus(0);

    const onCategorySelect = (temp: Partial<Booking>) => {
        setBooking((prev) => {
            if (!prev) {
                return {
                    category_id: temp.category_id ?? 0,
                    start: temp.start ?? null,
                    end: temp.end ?? null,
                    price: temp.price ?? 0,
                    startLocation: temp.startLocation ?? "",
                    endLocation: temp.endLocation ?? "",
                    telephone: "",
                    drivers: [],
                };
            }
            return {
                ...prev,
                category_id: temp.category_id ?? prev.category_id,
                start: temp.start ?? prev.start,
                end: temp.end ?? prev.end,
                price: temp.price ?? prev.price,
                startLocation: temp.startLocation ?? prev.startLocation,
                endLocation: temp.endLocation ?? prev.endLocation,
            };
        });
        setStepStatus(1);
    };

    const onDashboardNavigate = () => navigate("/dashboard/overview");

    const isMobile = width >= 3.38;

    const pickupLabel =
        booking && booking.start
            ? `${booking.startLocation || ""}, ${dayjs(booking.start).format("DD/MM/YYYY HH:mm")}`
            : "";
    const dropoffLabel =
        booking && booking.end
            ? `${booking.endLocation || ""}, ${dayjs(booking.end).format("DD/MM/YYYY HH:mm")}`
            : "";

    return (
        <div style={{ padding: isMobile ? "0px" : "20px" }}>
            {!isItFinished ? (
                <>
                    <Steps
                        current={stepStatus}
                    />

                    {stepStatus === 1 && (
                        <div style={{ display: "flex", justifyContent: "start"}}>
                            <Button onClick={onPrevious} icon={<i className="bi bi-arrow-left-circle" />}>
                                Πίσω Στην Αναζήτηση
                            </Button>
                        </div>
                    )}

                    {stepStatus === 0 && <SearchPage onSubmit={onCategorySelect} />}

                    {stepStatus === 1 && booking && (
                        <BookingWizard
                            onSubmit={onChooseUser}
                            baseTotal={booking.price ?? 0}
                            currency="EUR"
                            // optional visuals – if you have them, pass along:
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
                </>
            ) : (
                <Result
                    status="success"
                    title="Booking added successfully!"
                    extra={[
                        <Button type="primary" key="console" onClick={onDashboardNavigate} icon={<HomeOutlined />}>
                            Go to Dashboard
                        </Button>,
                    ]}
                />
            )}
        </div>
    );
}

export default AddBooking;
