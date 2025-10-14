// src/pages/booking/SearchPage.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
    AutoComplete,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    List,
    message,
    Row,
    Grid,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { myApi } from "../../resources/service"; // ⬅ removed getLangPrefix
import DateForm, { myDateForm } from "../../components/search/search/DateForm";
import AvailabilityCard from "../../components/search/search/AvailabilityCard";
import CategorySearchFilters from "../../components/search/CategorySearchFilters";
import { withLang } from "../../resources/useLangRouter"; // ⬅ add this

const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

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

type Filters = {
    category_name?: string;
    type?: string;
    fuel?: string;
    numOfSeats?: string;
    automatic?: "true" | "false" | undefined;
};

type UIFilters = {
    type?: string[];
    fuelType?: string[];
    numOfSeats?: string[];
    automatic?: "off" | "true" | "false";
};

function SearchPage({ onSubmit }: Props) {
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [form] = Form.useForm();
    const [sp, setSp] = useSearchParams();
    const navigate = useNavigate();
    const screens = useBreakpoint();

    const readParams = useCallback(() => {
        const startIso = sp.get("start");
        const endIso = sp.get("end");
        const sl = sp.get("sl") ?? "";
        const dl = sp.get("dl") ?? "";
        const start = startIso ? dayjs(startIso) : null;
        const end = endIso ? dayjs(endIso) : null;
        return { start, end, startLocation: sl, endLocation: dl };
    }, [sp]);

    const csvToArr = useCallback((csv?: string): string[] => {
        return csv ? csv.split(",").filter(Boolean) : [];
    }, []);

    const [filters, setFilters] = useState<Filters>(() => readFiltersFromUrl(sp));

    const initialUIFilters = useMemo<UIFilters>(() => {
        const automatic: "off" | "true" | "false" =
            typeof filters.automatic === "undefined" ? "off" : filters.automatic;

        return {
            type: csvToArr(filters.type),
            fuelType: csvToArr(filters.fuel),
            numOfSeats: csvToArr(filters.numOfSeats),
            automatic,
        };
    }, [filters, csvToArr]);

    const locationOptions: OptionType[] = useMemo(
        () => [
            { value: "Skypark", label: "Skypark" },
            { value: "4Rent Office", label: "4Rent Office" },
            { value: "Thessaloniki Hotel/Airnbnb", label: "Thessaloniki Hotel/Airnbnb" },
        ],
        []
    );

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

    const writeFiltersToUrl = useCallback(
        (f: Filters) => {
            const next = new URLSearchParams(sp);
            if (f.category_name) next.set("fn", f.category_name);
            else next.delete("fn");

            if (f.type) next.set("ft", f.type);
            else next.delete("ft");

            if (f.fuel) next.set("ff", f.fuel);
            else next.delete("ff");

            if (f.numOfSeats) next.set("fs", f.numOfSeats);
            else next.delete("fs");

            if (typeof f.automatic !== "undefined") next.set("fa", f.automatic);
            else next.delete("fa");

            setSp(next, { replace: true });
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

    const fetchAvailability = useCallback(async () => {
        try {
            if (!dateParams.start || !dateParams.end) return;
            const params: Record<string, any> = {
                start: dateParams.start.format("YYYY-MM-DDTHH:mm"),
                end: dateParams.end.format("YYYY-MM-DDTHH:mm"),
            };

            if (filters.category_name) params.category_name = filters.category_name;
            if (filters.type) params.type = filters.type;
            if (filters.fuel) params.fuel = filters.fuel;
            if (filters.numOfSeats) {
                params.seats = filters.numOfSeats;
                params.numOfSeats = filters.numOfSeats;
            }
            if (typeof filters.automatic !== "undefined") params.automatic = filters.automatic;

            const { data } = await myApi.get(`availability/search`, { params });
            setAvailabilities(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            message.error("Failed to fetch availabilities");
            setAvailabilities([]);
        }
    }, [dateParams, filters]);

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
            setFilters(readFiltersFromUrl(sp));
            fetchAvailability();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    // ---- Result selection
    const handleSelect = (id: number) => {
        const { start, end, startLocation, endLocation } = readParams();
        if (!start || !end || !startLocation || !endLocation) {
            message.warning("Please select dates and locations first.");
            return;
        }
        const selected = availabilities.find((a) => a.category.id === id);
        if (!selected) return message.error("Selected category not found.");

        const params = new URLSearchParams(sp);
        // ✅ Prefix with current language automatically (supports en / el-GR)
        const target = withLang(`/book/${id}/extra?${params.toString()}`);
        navigate(target);

        onSubmit({
            category_id: id,
            start,
            end,
            price: selected.totalPrice,
            startLocation,
            endLocation,
        });
    };

    const handleDatesSubmit = (dateForm: myDateForm) => {
        writeParams({
            start: dateForm.start,
            end: dateForm.end,
            sl: dateForm.startLocation ?? "",
            dl: dateForm.endLocation ?? "",
        });
        setDateParams({ start: dateForm.start, end: dateForm.end });
    };

    const handleInlineSubmit = () => {
        form.validateFields().then((values) => {
            const { startLocation, endLocation, dateRange } = values;
            const [start, end] = dateRange as [Dayjs, Dayjs];
            writeParams({ start, end, sl: startLocation, dl: endLocation });
            setDateParams({ start, end });
        });
    };

    const onFilterChange = (name: string, value: string | number | boolean | null) => {
        setFilters((prev) => {
            const next: Filters = { ...prev };
            if (name === "category_name") next.category_name = (value as string) || undefined;
            if (name === "type") next.type = (value as string) || undefined;
            if (name === "fuel") next.fuel = (value as string) || undefined;
            if (name === "numOfSeats") next.numOfSeats = (value as string) || undefined;
            if (name === "automatic")
                next.automatic = typeof value === "undefined" ? undefined : (value as "true" | "false");
            writeFiltersToUrl(next);
            return next;
        });
    };

    const clearAllFilters = () => {
        const cleared: Filters = {};
        setFilters(cleared);
        writeFiltersToUrl(cleared);
    };

    return (
        <div style={{ margin: "0 auto", width: "95%" }}>
            <Card
                style={{
                    borderRadius: 12,
                    border: "1px solid #e6e9f5",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.04)",
                    padding: 20,
                    marginTop: 16,
                    marginBottom: 16,
                }}
            >
                <DateForm onDateFormSubmit={handleDatesSubmit} />
            </Card>

            <Row gutter={[16, 16]} align="top">
                <Col xs={24} lg={7} xl={5} xxl={4}>
                    <div style={{ position: screens.lg ? "sticky" : "static", top: 16 }}>
                        <CategorySearchFilters
                            onFilterChange={onFilterChange}
                            clearAll={clearAllFilters}
                            initialFilters={initialUIFilters}
                        />
                    </div>
                </Col>

                <Col xs={24} lg={17} xl={19} xxl={20}>
                    <List
                        grid={{
                            gutter: 16,
                            column: screens.xxl ? 3 : screens.xl ? 3 : screens.lg ? 2 : screens.md ? 2 : 1,
                        }}
                        dataSource={availabilities}
                        renderItem={(av: Availability) => (
                            <List.Item key={av.category.id}>
                                <AvailabilityCard av={av} onSelect={handleSelect} />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>

            <Form form={form} onFinish={handleInlineSubmit} style={{ display: "none" }}>
                <Form.Item name="startLocation">
                    <AutoComplete<OptionType> options={locationOptions}>
                        <Input />
                    </AutoComplete>
                </Form.Item>
                <Form.Item name="endLocation">
                    <AutoComplete<OptionType> options={locationOptions}>
                        <Input />
                    </AutoComplete>
                </Form.Item>
                <Form.Item name="dateRange">
                    <RangePicker showTime={{ format: "HH:mm", minuteStep: 15 }} format="DD-MMM-YYYY, HH:mm" />
                </Form.Item>
            </Form>
        </div>
    );
}

export default SearchPage;

// ---------- helpers ----------
function readFiltersFromUrl(sp: URLSearchParams): Filters {
    const fn = (sp.get("fn") || "").trim();
    const ft = (sp.get("ft") || "").trim();
    const ff = (sp.get("ff") || "").trim();
    const fs = (sp.get("fs") || "").trim();
    const fa = sp.get("fa");

    return {
        category_name: fn || undefined,
        type: ft || undefined,
        fuel: ff || undefined,
        numOfSeats: fs || undefined,
        automatic: fa === "true" ? "true" : fa === "false" ? "false" : undefined,
    };
}
