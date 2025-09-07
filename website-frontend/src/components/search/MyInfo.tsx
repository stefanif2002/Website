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
    message,
    Switch,
    Divider,
} from "antd";
import type { FormInstance } from "antd/es/form";
import { myApi } from "../../resources/service";

const { Title, Text } = Typography;

type CountryOption = { label: string; value: string };

type Props = {
    form: FormInstance;
    onPrev?: () => void;
    onNext?: () => void; // proceed to next step after successful submit
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

const MyInfo: React.FC<Props> = ({
                                     form,
                                     onPrev,
                                     onNext,
                                     countryOptions = DEFAULT_COUNTRIES,
                                 }) => {
    const handleNext = async () => {
        // Validate ALL required fields (VAT & company fields are intentionally omitted)
        await form.validateFields([
            "telephone",
            "email",
            "name",
            "last_name",
            "number_of_people",
            "driver_license",
            "driver_license_country",
            "address",
            "city",
            "postal_code",
            "country",
            "passport",
            "passport_country",
        ]);

        // Build user DTO and send to backend
        const {
            telephone,
            email,
            name,
            last_name,
            address,
            postal_code,
            city,
            country,
            vat_number, // optional
            driver_license,
            driver_license_country,
            passport,
            passport_country,
            company = false, // boolean toggle
            company_name, // optional
        } = form.getFieldsValue([
            "telephone",
            "email",
            "name",
            "last_name",
            "address",
            "postal_code",
            "city",
            "country",
            "vat_number",
            "driver_license",
            "driver_license_country",
            "passport",
            "passport_country",
            "company",
            "company_name",
        ]) as any;

        const userDto = {
            email,
            name,
            last_name,
            telephone,
            address,
            postal_code,
            city,
            country,
            vat_number: vat_number || null, // optional
            driver_license,
            driver_license_country,
            passport,               // required
            passport_country,       // required
            company: company,     // optional toggle
            company_name: company ? company_name || null : null, // optional
        };

        try {
            await myApi.post("booking/createUser", userDto);
            message.success("Τα στοιχεία σας αποθηκεύτηκαν.");
            onNext?.(); // continue only after successful save
        } catch (e) {
            message.error("Αποτυχία αποθήκευσης στοιχείων. Προσπαθήστε ξανά.");
        }
    };

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

                {/* Optional field */}
                <Col xs={24} md={12}>
                    <Form.Item name="flight" label="Πτήση (προαιρετικό)">
                        <Input placeholder="π.χ. A3 123" />
                    </Form.Item>
                </Col>
            </Row>

            <Title level={5} style={{ marginTop: 8 }}>Στοιχεία Ταυτότητας</Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="passport"
                        label="Αριθμός Διαβατηρίου"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε διαβατήριο" }]}
                    >
                        <Input placeholder="Αριθμός διαβατηρίου" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="passport_country"
                        label="Χώρα έκδοσης διαβατηρίου"
                        rules={[{ required: true, message: "Παρακαλώ επιλέξτε χώρα" }]}
                    >
                        <Select
                            placeholder="Επιλέξτε χώρα"
                            options={countryOptions}
                            optionFilterProp="label"
                            showSearch
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Title level={5} style={{ marginTop: 8 }}>Στοιχεία Οδήγησης</Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="driver_license"
                        label="Δίπλωμα οδήγησης"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε δίπλωμα" }]}
                    >
                        <Input placeholder="Αριθμός διπλώματος" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="driver_license_country"
                        label="Χώρα διπλώματος"
                        rules={[{ required: true, message: "Παρακαλώ επιλέξτε χώρα" }]}
                    >
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
                    <Form.Item
                        name="address"
                        label="Διεύθυνση"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε διεύθυνση" }]}
                    >
                        <Input placeholder="Οδός & αριθμός" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="city"
                        label="Πόλη"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε πόλη" }]}
                    >
                        <Input placeholder="Πόλη" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="postal_code"
                        label="Ταχυδρομικός κώδικας"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε ΤΚ" }]}
                    >
                        <Input placeholder="ΤΚ" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="country"
                        label="Χώρα"
                        rules={[{ required: true, message: "Παρακαλώ επιλέξτε χώρα" }]}
                    >
                        <Select
                            placeholder="Επιλέξτε χώρα"
                            options={countryOptions}
                            optionFilterProp="label"
                            showSearch
                        />
                    </Form.Item>
                </Col>

                {/* VAT optional */}
                <Col xs={24} md={12}>
                    <Form.Item name="vat_number" label="ΑΦΜ (προαιρετικό)">
                        <Input placeholder="π.χ. EL123456789" />
                    </Form.Item>
                </Col>
            </Row>

            <Divider />

            <Title level={5} style={{ marginTop: 0 }}>Στοιχεία Εταιρείας (προαιρετικό)</Title>
            <Row gutter={[16, 8]} align="middle">
                <Col xs={24} md={12}>
                    <Form.Item
                        name="company"
                        label="Τιμολόγιο σε εταιρεία;"
                        valuePropName="checked"
                        colon={false}
                    >
                        <Switch />
                    </Form.Item>
                </Col>
            </Row>

            {/* Show company fields only if switch is ON (still optional) */}
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.company !== cur.company}>
                {({ getFieldValue }) =>
                    getFieldValue("company") ? (
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="company_name"
                                    label="Επωνυμία Εταιρείας (προαιρετικό)"
                                >
                                    <Input placeholder="Επωνυμία" />
                                </Form.Item>
                            </Col>
                            {/* VAT remains optional; it’s above as well. If you prefer to show it only here, move that Form.Item down */}
                        </Row>
                    ) : null
                }
            </Form.Item>

            {/* Optional notes (not part of createUser, but kept for booking) */}
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
