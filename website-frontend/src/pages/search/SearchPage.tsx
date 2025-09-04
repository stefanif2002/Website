// src/pages/booking/SearchPage.tsx
import {useCallback, useEffect, useMemo, useState} from "react";
import dayjs, { Dayjs } from "dayjs";
import {
    AutoComplete,
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    List,
    message,
    Popover,
    Row,
    Space,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { myApi, width, height } from "../../resources/service";
import DateForm, { myDateForm } from "../../components/search/search/DateForm";
import AvailabilityCard from "../../components/search/search/AvailabilityCard";

const { RangePicker } = DatePicker;

interface DriverDto {
    telephone: string;
    name: string;
    last_name: string;
    driver_license: string;
}
interface Booking {
    telephone: string;
    category_id: number;
    start: Dayjs;
    end: Dayjs;
    drivers: DriverDto[];
    price: number;
    startLocation: string;
    endLocation: string;
}
interface Category {
    id: number;
    name: string;
    type: string;
    fuel: string;
    numOfSeats: number;
    pricePerDay: number;
    automatic: boolean;
    imageUrl: string;
    color: string;
    description: string;
}
interface Availability {
    category: Category;
    totalPrice: number;
    averagePricePerDay: number;
}
type OptionType = { value: string; label: React.ReactNode };
type Props = { onSubmit: (booking: Partial<Booking>) => void };

function SearchPage({ onSubmit }: Props) {
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [form] = Form.useForm();
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [sp, setSp] = useSearchParams();
    const navigate = useNavigate();

    const locationOptions: OptionType[] = useMemo(
        () => [
            { value: "Skypark", label: "Skypark" },
            { value: "4Rent Office", label: "4Rent Office" },
            { value: "Thessaloniki Hotel/Airnbnb", label: "Thessaloniki Hotel/Airnbnb" },
        ],
        []
    );

    // Helpers to read/write query params
    const readParams = useCallback(() => {
        const startIso = sp.get("start");
        const endIso = sp.get("end");
        const sl = sp.get("sl") ?? "";
        const dl = sp.get("dl") ?? "";
        const start = startIso ? dayjs(startIso) : null;
        const end = endIso ? dayjs(endIso) : null;
        return { start, end, startLocation: sl, endLocation: dl };
    }, [sp]);

    const writeParams = useCallback(
        (args: { start?: Dayjs | null; end?: Dayjs | null; sl?: string; dl?: string }) => {
            const next = new URLSearchParams(sp);
            if (args.start) next.set("start", args.start.toISOString());
            if (args.end) next.set("end", args.end.toISOString());
            if (typeof args.sl === "string") next.set("sl", args.sl);
            if (typeof args.dl === "string") next.set("dl", args.dl);
            setSp(next, { replace: false });
        },
        [sp, setSp]
    );

    const [dateParams, setDateParams] = useState<{ start: Dayjs | null; end: Dayjs | null }>(() => {
        const { start, end } = readParams();
        return {
            start: start ?? dayjs().add(1, "day").minute(0),
            end: end ?? dayjs().add(2, "day").minute(0),
        };
    });

    // Fetch availabilities
    const fetchAvailability = useCallback(async () => {
        try {
            if (!dateParams.start || !dateParams.end) return;
            const { data } = await myApi.get(`availability/search`, {
                params: {
                    start: dateParams.start.format("YYYY-MM-DDTHH:mm"),
                    end: dateParams.end.format("YYYY-MM-DDTHH:mm"),
                },
            });
            setAvailabilities(data || []);
        } catch (e) {
            console.error(e);
            message.error("Failed to fetch availabilities");
            setAvailabilities([]);
        }
    }, [dateParams]);

    // Init form from URL on first mount, and trigger search if both dates exist
    useEffect(() => {
        const { start, end, startLocation, endLocation } = readParams();
        form.setFieldsValue({
            startLocation: startLocation ?? "",
            endLocation: endLocation ?? "",
            dateRange:
                start && end ? [start, end] : [dayjs().add(1, "day").minute(0), dayjs().add(2, "day").minute(0)],
        });
        if (start && end) {
            setDateParams({ start, end });
            fetchAvailability();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // only on first mount

    const handleSelect = (id: number) => {
        const { start, end, startLocation, endLocation } = readParams();
        if (!start || !end || !startLocation || !endLocation) {
            message.warning("Please select dates and locations first.");
            return;
        }

        const selected = availabilities.find((a) => a.category.id === id);
        if (!selected) {
            message.error("Selected category not found.");
            return;
        }

        // Navigate to addons step with category id, preserving params
        const params = new URLSearchParams(sp);
        navigate(`/book/${id}/extra?${params.toString()}`);

        // Also pass data up (if you keep state in parent)
        onSubmit({
            category_id: id,
            start,
            end,
            price: selected.totalPrice,
            startLocation,
            endLocation,
        });
    };

    // DateForm (mobile card) callback
    const handleDatesSubmit = (dateForm: myDateForm) => {
        writeParams({
            start: dateForm.start,
            end: dateForm.end,
            sl: dateForm.startLocation ?? "",
            dl: dateForm.endLocation ?? "",
        });
        setDateParams({ start: dateForm.start, end: dateForm.end });
        fetchAvailability();
    };

    // Popover form (desktop) submit
    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const { startLocation, endLocation, dateRange } = values;
            const [start, end] = dateRange as [Dayjs, Dayjs];
            writeParams({ start, end, sl: startLocation, dl: endLocation });
            setDateParams({ start, end });
            fetchAvailability();
            setPopoverVisible(false);
        });
    };

    // Render … (unchanged layout apart from URL wiring)
    const bookingFiltersContent = (
        <div
            style={{
                marginInline: "10px",
                maxHeight: height > 1.5 ? "300px" : "350px",
                overflowY: "auto",
                marginBottom: "20px",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#fff",
                width: "230px",
                margin: "auto",
                overflowX: "hidden",
            }}
        >
            <Form layout="vertical" onFinish={handleSubmit} form={form}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="startLocation"
                            label="Pick Up At"
                            rules={[{ required: true, message: "Please enter pick location" }]}
                            validateTrigger="onSubmit"
                        >
                            <AutoComplete<OptionType> options={locationOptions}>
                                <Input prefix={<i className="bi bi-geo-alt" />} placeholder="Airport or Anywhere" />
                            </AutoComplete>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="endLocation"
                            label="Drop Off At"
                            rules={[{ required: true, message: "Please enter drop off location" }]}
                            validateTrigger="onSubmit"
                        >
                            <AutoComplete<OptionType> options={locationOptions}>
                                <Input prefix={<i className="bi bi-geo-alt" />} placeholder="Airport or Anywhere" />
                            </AutoComplete>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="dateRange"
                            label={
                                <Space>
                                    <FontAwesomeIcon icon={faCalendar} /> Dates
                                </Space>
                            }
                            rules={[{ required: true, message: "Please select the dates!" }]}
                        >
                            <RangePicker
                                style={{ width: "100%" }}
                                showTime={{ format: "HH:mm", minuteStep: 15 }}
                                format="DD-MMM-YYYY, HH:mm"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item style={{ display: "flex", justifyContent: "right" }}>
                    <Button color="primary" variant="outlined" htmlType="submit">
                        Search
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );

    return (
        <div style={{ margin: "auto", width: "80%" }}>
            {width < 3.4 ? (
                <>
                    <Card
                        style={{
                            textAlign: "center",
                            justifyContent: "center",
                            alignContent: "center",
                            width: "100%",
                            borderRadius: 12,
                            border: "1px solid #e6e9f5",
                            boxShadow: "0 6px 24px rgba(0,0,0,0.04)",
                            padding: 20,
                        }}
                    >
                        <DateForm onDateFormSubmit={handleDatesSubmit} isItMainPage />
                    </Card>
                    <Row style={{ justifyContent: "center", display: "flex" }}>
                        <Col
                            style={{
                                marginTop: "30px",
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                            }}
                        >
                            <div>
                                <List
                                    grid={{ gutter: 16, column: width >= 3 ? 1 : width >= 1.6 ? 2 : 3 }}
                                    dataSource={availabilities}
                                    renderItem={(av) => (
                                        <List.Item key={av.category.id}>
                                            <AvailabilityCard
                                                av={av}
                                                onSelect={handleSelect}
                                                discountPercent={20}
                                                isSoldOut={false}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Col>
                    </Row>
                </>
            ) : (
                <div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "30px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "center",
                                overflowX: "hidden",
                            }}
                        >
                            <Popover
                                placement="bottomRight"
                                content={bookingFiltersContent}
                                trigger="click"
                                open={popoverVisible}
                                onOpenChange={setPopoverVisible}
                            >
                                <Button icon={<FontAwesomeIcon icon={faCalendar} />}>Select Dates & Loc/s</Button>
                            </Popover>
                        </div>
                    </div>

                    <List
                        grid={{
                            gutter: 16,
                            column: width >= 3 ? 1 : width >= 1.6 ? 2 : width >= 1.28 ? 3 : 4,
                        }}
                        dataSource={availabilities}
                        style={{ marginTop: "10px" }}
                        renderItem={(av: Availability) => (
                            <List.Item key={av.category.id}>
                                <AvailabilityCard av={av} onSelect={handleSelect} />
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </div>
    );
}

export default SearchPage;
