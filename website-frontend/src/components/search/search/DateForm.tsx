import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
    Button,
    Col,
    DatePicker,
    Form,
    Grid,
    Row,
    Select,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faLocationDot } from "@fortawesome/free-solid-svg-icons";

interface DateFormProps {
    onDateFormSubmit: (dateForm: myDateForm) => void;
}

export interface myDateForm {
    startLocation: string | null;
    endLocation: string | null;
    start: Dayjs | null;
    end: Dayjs | null;
}

interface OptionType {
    value: string;
    label: React.ReactNode;
}

const aeBlue = "#2F5AFF";
const baseFieldBox: React.CSSProperties = {
    background: "#f6f8ff",
    border: "1px solid #e6e9f5",
    borderRadius: 10,
    padding: 12,
    display: "flex",
    alignItems: "center",
    gap: 10,
};

const tinyLabel: React.CSSProperties = {
    position: "absolute",
    top: -10,
    left: 12,
    background: "white",
    padding: "0 6px",
    fontSize: 12,
    color: "#7d88b0",
};

const { useBreakpoint } = Grid;

const DateForm: React.FC<DateFormProps> = ({ onDateFormSubmit }) => {
    const [form] = Form.useForm();
    const screens = useBreakpoint();

    // dynamic heights/spacing per breakpoint
    const fieldHeight = screens.xs ? 52 : 64;
    const fieldBoxStyle = { ...baseFieldBox, height: fieldHeight };

    const locationOptions: OptionType[] = [
        { value: "Skypark", label: "Skypark" },
        { value: "4Rent Office", label: "4Rent Office" },
        { value: "Thessaloniki Hotel/Airnbnb", label: "Thessaloniki Hotel/Airnbnb" },
    ];

    const [startLocation, setStartLocation] = useState<string | null>(null);
    const [endLocation, setEndLocation] = useState<string | null>(null);

    // watch startDate so we can disable invalid end dates
    const startDate = Form.useWatch<Dayjs | null>("startDate", form);

    useEffect(() => {
        setStartLocation("4Rent Office");
        setEndLocation("4Rent Office");
        form.setFieldsValue({
            startLocation: "4Rent Office",
            endLocation: "4Rent Office",
            startDate: dayjs().add(1, "day").minute(0),
            endDate: dayjs().add(2, "day").minute(0),
        });
    }, [form]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const start = values.startDate as Dayjs;
            const end = values.endDate as Dayjs;
            onDateFormSubmit({
                startLocation,
                endLocation,
                start,
                end,
            });
        });
    };

    return (
        <div style={{ width: "100%" }}>
            {/* center & constrain the whole bar */}
            <div style={{ maxWidth: 1120, margin: "0 auto" }}>
                <Form form={form} onFinish={handleSubmit} style={{ width: "100%" }}>
                    {/* Responsive: xs=stacked, sm=2 per row, lg+=4 per row + button */}
                    <Row gutter={[12, 12]} justify="center" wrap>
                        <Col xs={12} xl={6} xxl={5}>
                            <div style={{ position: "relative" }}>
                                <span style={tinyLabel}>Πού θα το παραλάβετε;</span>
                                <div style={fieldBoxStyle}>
                                    <FontAwesomeIcon color={aeBlue} icon={faLocationDot} />
                                    <Form.Item name="startLocation" noStyle rules={[{ required: true }]}>
                                        <Select
                                            bordered={false}
                                            options={locationOptions}
                                            onChange={setStartLocation}
                                            style={{ width: "100%" }}
                                            placeholder="Θεσσαλονίκη (SKG)"
                                            showSearch
                                            optionFilterProp="label"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </Col>

                        <Col xs={12} xl={6} xxl={5}>
                            <div style={{ position: "relative" }}>
                                <span style={tinyLabel}>Πού θα το επιστρέψετε;</span>
                                <div style={fieldBoxStyle}>
                                    <FontAwesomeIcon color={aeBlue} icon={faLocationDot} />
                                    <Form.Item name="endLocation" noStyle rules={[{ required: true }]}>
                                        <Select
                                            bordered={false}
                                            options={locationOptions}
                                            onChange={setEndLocation}
                                            style={{ width: "100%" }}
                                            placeholder="Προορισμός ή διεύθυνση"
                                            showSearch
                                            optionFilterProp="label"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} lg={12} xl={6} xxl={5}>
                            <div style={{ position: "relative" }}>
                                <span style={tinyLabel}>Ημερομηνία παραλαβής</span>
                                <div style={fieldBoxStyle}>
                                    <FontAwesomeIcon color={aeBlue} icon={faCalendar} />
                                    <Form.Item
                                        name="startDate"
                                        noStyle
                                        rules={[{ required: true, message: "Επιλέξτε ημερομηνία παραλαβής" }]}
                                    >
                                        <DatePicker
                                            bordered={false}
                                            style={{ width: "100%" }}
                                            showTime={{ format: "HH:mm", minuteStep: 15 }}
                                            format="DD-MMM-YYYY, HH:mm"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} lg={12} xl={6} xxl={5}>
                            <div style={{ position: "relative" }}>
                                <span style={tinyLabel}>Ημερομηνία επιστροφής</span>
                                <div style={fieldBoxStyle}>
                                    <FontAwesomeIcon color={aeBlue} icon={faCalendar} />
                                    <Form.Item
                                        name="endDate"
                                        noStyle
                                        rules={[{ required: true, message: "Επιλέξτε ημερομηνία επιστροφής" }]}
                                    >
                                        <DatePicker
                                            bordered={false}
                                            style={{ width: "100%" }}
                                            showTime={{ format: "HH:mm", minuteStep: 15 }}
                                            format="DD-MMM-YYYY, HH:mm"
                                            // Block all dates earlier than startDate + 1 day
                                            disabledDate={(current) => {
                                                if (!startDate) return false;
                                                const minEnd = startDate.add(1, "day").startOf("day");
                                                return !!current && current.isBefore(minEnd, "day");
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </Col>

                        <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={12}
                            xxl={4}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: screens.xxl ? "flex-end" : "center",
                            }}
                        >
                            <Button
                                htmlType="submit"
                                size="large"
                                style={{
                                    height: 48,
                                    padding: "0 28px",
                                    borderRadius: 999,
                                    background: "linear-gradient(180deg, #5f7bff 0%, #2f5aff 100%)",
                                    color: "#fff",
                                    boxShadow: "0 8px 20px rgba(47,90,255,0.25)",
                                    border: 0,
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    lineHeight: 1,
                                    width: screens.xs ? "100%" : "auto",
                                }}
                            >
                                Αναζήτηση
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default DateForm;
