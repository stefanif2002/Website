// src/components/search/MyInfo.tsx
import React from "react";
import {
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Space,
    Typography,
} from "antd";
import type { FormInstance } from "antd/es/form";

const { Title, Text } = Typography;

type CountryOption = { label: string; value: string };

type Props = {
    form: FormInstance;
    onPrev?: () => void;
    onNext?: () => void;     // proceed to next step after validate
    onFinish?: () => void;   // optional finish from this step
    countryOptions?: CountryOption[]; // optional override
};

const DEFAULT_COUNTRIES: CountryOption[] = [
    { value: "GR", label: "Greece" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "IT", label: "Italy" },
    { value: "GB", label: "United Kingdom" },
    { value: "US", label: "United States" },
    { value: "OTHER", label: "Other" },
];

const MyInfo: React.FC<Props> = ({ form, onPrev, onNext, countryOptions = DEFAULT_COUNTRIES }) => {
    const handleNext = async () => {
        await form.validateFields([
            "telephone",
            "email",
            "name",
            "last_name",
            "number_of_people",
        ]);
        onNext?.();
    };

    // Removed unused handleFinishNow

    return (
        <div>
            <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>
                Στοιχεία Επικοινωνίας
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="telephone"
                        label="Τηλέφωνο"
                        rules={[
                            { required: true, message: "Παρακαλώ εισάγετε τηλέφωνο" },
                            { pattern: /^[0-9+()\-.\s]{6,}$/, message: "Μη έγκυρος αριθμός" },
                        ]}
                    >
                        <Input placeholder="+30 69..." />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Παρακαλώ εισάγετε email" },
                            { type: "email", message: "Μη έγκυρο email" },
                        ]}
                    >
                        <Input placeholder="name@example.com" />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        name="name"
                        label="Όνομα"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε όνομα" }]}
                    >
                        <Input placeholder="Όνομα" />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        name="last_name"
                        label="Επώνυμο"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε επώνυμο" }]}
                    >
                        <Input placeholder="Επώνυμο" />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        name="number_of_people"
                        label="Αριθμός ατόμων"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε αριθμό ατόμων" }]}
                    >
                        <InputNumber min={1} style={{ width: "100%" }} placeholder="1" />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item name="flight" label="Πτήση (προαιρετικό)">
                        <Input placeholder="π.χ. A3 123" />
                    </Form.Item>
                </Col>
            </Row>

            <Title level={5} style={{ marginTop: 8 }}>Στοιχεία Οδήγησης</Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item name="driver_license" label="Δίπλωμα οδήγησης">
                        <Input placeholder="Αριθμός διπλώματος" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="driver_license_country" label="Χώρα διπλώματος">
                        <Select
                            placeholder="Επιλέξτε χώρα"
                            options={countryOptions}
                            optionFilterProp="label"
                            showSearch
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Title level={5} style={{ marginTop: 8 }}>Διεύθυνση</Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item name="address" label="Διεύθυνση">
                        <Input placeholder="Οδός & αριθμός" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="city" label="Πόλη">
                        <Input placeholder="Πόλη" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="postal_code" label="Ταχυδρομικός κώδικας">
                        <Input placeholder="ΤΚ" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="country" label="Χώρα">
                        <Select
                            placeholder="Επιλέξτε χώρα"
                            options={countryOptions}
                            optionFilterProp="label"
                            showSearch
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="notes" label="Σημειώσεις (προαιρετικό)">
                <Input.TextArea rows={3} placeholder="Οδηγίες παράδοσης, ειδικές ανάγκες κ.λπ." />
            </Form.Item>

            <Title level={5} style={{ marginTop: 8 }}>Επιπλέον οδηγοί (προαιρετικό)</Title>
            <Form.List name="drivers">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field, idx) => (
                            <Row key={field.key} gutter={12} align="middle">
                                <Col xs={24} md={8}>
                                    <Text type="secondary">Οδηγός #{idx + 2}</Text>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name={[field.name, "telephone"]}
                                        rules={[{ required: true, message: "Τηλέφωνο οδηγού" }]}
                                    >
                                        <Input placeholder="Τηλέφωνο οδηγού" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={7}>
                                    <Form.Item
                                        name={[field.name, "name"]}
                                        rules={[{ required: true, message: "Όνομα οδηγού" }]}
                                    >
                                        <Input placeholder="Όνομα οδηγού" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={1}>
                                    <Button danger onClick={() => remove(field.name)}>✕</Button>
                                </Col>
                            </Row>
                        ))}
                        <Button type="dashed" onClick={() => add()} block>
                            Προσθήκη οδηγού
                        </Button>
                    </>
                )}
            </Form.List>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <Space>
                    <Button onClick={onPrev}>ΠΙΣΩ</Button>
                </Space>
                <Space>
                    <Button type="primary" onClick={handleNext}>ΣΥΝΕΧΕΙΑ</Button>
                </Space>
            </div>
        </div>
    );
};

export default MyInfo;
