// src/components/search/CategorySearchFilters.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { myApi, width } from "../../resources/service";
import {
    Button,
    Card,
    Divider,
    Form,
    message,
    Radio,
    Row,
    Col,
    Space,
    Tag,
    Tooltip,
    Select,
    Checkbox,
} from "antd";
import { RadioChangeEvent } from "antd/es/radio/interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCarSide,
    faGasPump,
    faGears,
    faUsers,
    faBroom,
    faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
    // unchanged: we’ll send comma-separated strings for multi-values
    onFilterChange: (
        name: string,
        value: string | number | boolean | null | undefined
    ) => void;
    clearAll: () => void;
    initialFilters?: {
        type?: string[];         // e.g. ["SUV","Hatchback"]
        fuelType?: string[];     // e.g. ["Petrol","Hybrid"]
        numOfSeats?: string[];   // e.g. ["4","7"]
        automatic?: "off" | "true" | "false";
    };
}

type OptionType = { value: string; label: React.ReactNode };

const seatsChoices = ["4", "5", "7", "9"];
const headerGradient =
    "linear-gradient(135deg, rgba(47,90,255,0.95) 0%, rgba(95,123,255,0.85) 60%, rgba(47,90,255,0.75) 100%)";

const CategorySearchFilters: React.FC<Props> = ({ onFilterChange, clearAll, initialFilters }) => {
    const [form] = Form.useForm();

    const [typeOptions, setTypeOptions] = useState<OptionType[]>([]);
    const [fuelTypeOptions, setFuelTypeOptions] = useState<OptionType[]>([]);

    // --- Fetch dropdown sources ---
    const fetchInitialData = useCallback(() => {
        Promise.all([myApi.get("category/types"), myApi.get("category/fuels")])
            .then(([categoriesResponse, fuelResponse]) => {
                setTypeOptions(
                    Array.isArray(categoriesResponse.data)
                        ? categoriesResponse.data.map((item: string) => ({
                            value: item,
                            label: item,
                        }))
                        : []
                );
                setFuelTypeOptions(
                    Array.isArray(fuelResponse.data)
                        ? fuelResponse.data.map((item: string) => ({ value: item, label: item }))
                        : []
                );
            })
            .catch((error) => {
                console.error("Error fetching data", error);
                message.error("Failed to fetch initial data for filters");
            });
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        form.setFieldsValue({
            type: initialFilters?.type ?? [],
            fuelType: initialFilters?.fuelType ?? [],
            numOfSeats: initialFilters?.numOfSeats ?? [],
            automatic: initialFilters?.automatic ?? "off",
        });
    }, [initialFilters, form]);

    // --- Emitters (multi fields emit CSV strings to keep parent API unchanged) ---
    const handleTypeMulti = (values: string[]) =>
        onFilterChange("type", values.length ? values.join(",") : undefined);

    const handleFuelMulti = (values: string[]) =>
        onFilterChange("fuel", values.length ? values.join(",") : undefined);

    const handleSeatsMulti = (values: string[]) =>
        onFilterChange("numOfSeats", values.length ? values.join(",") : null);

    const handleAutomatic = (e: RadioChangeEvent | "true" | "false" | "off") => {
        const v = typeof e === "string" ? e : e.target.value;
        onFilterChange("automatic", v === "off" ? undefined : (v as "true" | "false"));
    };

    // --- Active chips summary (reads current form state) ---
    const active = Form.useWatch([], form) || {};
    const activeChips = useMemo(() => {
        const chips: { key: string; label: React.ReactNode; onClear: () => void }[] = [];
        if (Array.isArray(active.type) && active.type.length)
            chips.push({ key: "type", label: <><FontAwesomeIcon icon={faCarSide}/> {active.type.join(", ")}</>,
                onClear: () => { form.setFieldsValue({ type: [] }); handleTypeMulti([]); } });
        if (Array.isArray(active.fuelType) && active.fuelType.length)
            chips.push({ key: "fuel", label: <><FontAwesomeIcon icon={faGasPump}/> {active.fuelType.join(", ")}</>,
                onClear: () => { form.setFieldsValue({ fuelType: [] }); handleFuelMulti([]); } });
        if (Array.isArray(active.numOfSeats) && active.numOfSeats.length)
            chips.push({ key: "numOfSeats", label: <><FontAwesomeIcon icon={faUsers}/> {active.numOfSeats.join(", ")} seats</>,
                onClear: () => { form.setFieldsValue({ numOfSeats: [] }); handleSeatsMulti([]); } });
        if (active.automatic && active.automatic !== "off")
            chips.push({ key: "automatic", label: <><FontAwesomeIcon icon={faGears}/> {active.automatic==="true"?"Auto":"Manual"}</>,
                onClear: () => { form.setFieldsValue({ automatic: "off" }); handleAutomatic("off"); } });
        return chips;
    }, [active]);

    const clearFilters = () => {
        form.resetFields();
        clearAll();
    };

    const isMobile = width >= 3.38;

    return (
        <Card
            bordered={false}
            style={{
                width: "100%",
                borderRadius: 14,
                boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
                overflow: "hidden",
            }}
            bodyStyle={{ padding: 0 }}
        >
            {/* Header */}
            <div
                style={{
                    background: headerGradient,
                    color: "white",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(255,255,255,0.18)",
                }}
            >
                <Space align="center" size={10}>
                    <FontAwesomeIcon icon={faCircleCheck} />
                    <span style={{ fontWeight: 700, letterSpacing: 0.2 }}>Φίλτρα</span>
                    {activeChips.length > 0 && (
                        <Tag color="gold" style={{ borderRadius: 999, marginLeft: 6 }}>
                            {activeChips.length}
                        </Tag>
                    )}
                </Space>
                <Tooltip title="Clear all filters">
                    <Button
                        size="small"
                        onClick={clearFilters}
                        icon={<FontAwesomeIcon icon={faBroom} />}
                        style={{ color: "#2F5AFF", background: "white", border: "none", fontWeight: 600 }}
                    >
                        Καθαρισμός
                    </Button>
                </Tooltip>
            </div>

            {/* Body */}
            <div style={{ padding: 16 }}>
                {activeChips.length > 0 && (
                    <>
                        <Space wrap size={[8, 8]} style={{ marginBottom: 8 }}>
                            {activeChips.map((c) => (
                                <Tag
                                    key={c.key}
                                    closable
                                    onClose={(e) => {
                                        e.preventDefault();
                                        c.onClear();
                                    }}
                                    style={{
                                        padding: "4px 8px",
                                        borderRadius: 999,
                                        background: "#f6f8ff",
                                        border: "1px solid #e6e9f5",
                                    }}
                                >
                                    {c.label}
                                </Tag>
                            ))}
                        </Space>
                        <Divider style={{ margin: "8px 0" }} />
                    </>
                )}

                <Form
                    layout="vertical"
                    form={form}
                    initialValues={{
                        type: [] as string[],
                        fuelType: [] as string[],
                        numOfSeats: [] as string[],
                        automatic: "off",
                    }}
                >
                    <Row gutter={[12, 12]}>
                        {/* Type (MULTI) */}
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <Space size={6}>
                                        <FontAwesomeIcon icon={faCarSide} />
                                        <span>Τύπος</span>
                                    </Space>
                                }
                                name="type"
                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    showSearch
                                    options={typeOptions}
                                    placeholder="Hatchback, SUV, ..."
                                    onChange={(vals) => handleTypeMulti(vals as string[])}
                                    tokenSeparators={[","]}
                                />
                            </Form.Item>
                        </Col>

                        {/* Fuel (MULTI) */}
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <Space size={6}>
                                        <FontAwesomeIcon icon={faGasPump} />
                                        <span>Καύσιμο</span>
                                    </Space>
                                }
                                name="fuelType"
                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    showSearch
                                    options={fuelTypeOptions}
                                    placeholder="Petrol, Diesel, Hybrid..."
                                    onChange={(vals) => handleFuelMulti(vals as string[])}
                                    tokenSeparators={[","]}
                                />
                            </Form.Item>
                        </Col>

                        {/* Seats (MULTI) – pills via Checkbox.Group */}
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <Space size={6}>
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span>Θέσεις</span>
                                    </Space>
                                }
                                name="numOfSeats"
                            >
                                <Checkbox.Group
                                    onChange={(vals) => handleSeatsMulti(vals as string[])}
                                    style={{ width: "100%" }}
                                >
                                    <Space wrap>
                                        {seatsChoices.map((s) => (
                                            <Checkbox
                                                key={s}
                                                value={s}
                                                style={{
                                                    padding: "4px 10px",
                                                    border: "1px solid #e6e9f5",
                                                    borderRadius: 999,
                                                }}
                                            >
                                                {s}
                                            </Checkbox>
                                        ))}
                                    </Space>
                                </Checkbox.Group>
                            </Form.Item>
                        </Col>

                        {/* Transmission (single) */}
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <Space size={6}>
                                        <FontAwesomeIcon icon={faGears} />
                                        <span>Μετάδοση</span>
                                    </Space>
                                }
                                name="automatic"
                            >
                                <Radio.Group
                                    onChange={handleAutomatic}
                                    optionType="button"
                                    buttonStyle="solid"
                                    style={{ display: "flex", gap: 8 }}
                                >
                                    <Radio.Button value="off" style={{ flex: 1, textAlign: "center" }}>
                                        All
                                    </Radio.Button>
                                    <Radio.Button value="false" style={{ flex: 1, textAlign: "center" }}>
                                        Manual
                                    </Radio.Button>
                                    <Radio.Button value="true" style={{ flex: 1, textAlign: "center" }}>
                                        Auto
                                    </Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Card>
    );
};

export default CategorySearchFilters;
