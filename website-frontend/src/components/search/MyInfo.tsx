// src/components/search/MyInfo.tsx
import React from "react";
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Space,
    Switch,
    Typography,
    message,
    Checkbox,
} from "antd";
import type { FormInstance } from "antd/es/form";
import { myApi } from "../../resources/service";
import {
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
    CalendarOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    NumberOutlined,
    GlobalOutlined,
    IdcardOutlined,
    BankOutlined,
    SendOutlined,
    UsergroupAddOutlined,
    TeamOutlined,
    CloseOutlined,
    PlusOutlined,
    ApartmentOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

type CountryOption = { label: string; value: string };

type Props = {
    form: FormInstance;
    onPrev?: () => void;
    onNext?: () => void;
    countryOptions?: CountryOption[];
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
    const isGreek = /^\/el(\/|$)/i.test(location.pathname);
    const termsHref = isGreek ? "/el/terms" : "/terms";

    const accepted = Form.useWatch<boolean>("acceptTerms", form) ?? false;
    const dob = Form.useWatch("date_of_birth", form);

    // --- AGE LOGIC ---
    const calcAge = (v: any): number | null => {
        if (!v) return null;
        const d = dayjs.isDayjs(v) ? v : dayjs(v);
        if (!d.isValid()) return null;
        // integer years difference
        return dayjs().diff(d, "year");
    };

    const age = calcAge(dob);
    const requiresExtraInsurance =
        age !== null && ((age >= 21 && age <= 23) || (age >= 65 && age <= 72));
    const isAgeBlocked = age !== null && (age < 21 || age > 72);

    const handleNext = async () => {
        // validate all fields (including DOB + acceptTerms)
        await form.validateFields();

        // hard-stop by age policy (defensive; validator also covers this)
        if (isAgeBlocked) {
            message.error(
                isGreek
                    ? "Δεν μπορείτε να προχωρήσετε. Η ηλικία πρέπει να είναι από 21 έως 72."
                    : "You cannot proceed. Age must be between 21 and 72."
            );
            return;
        }

        const values = form.getFieldsValue(true) as any;

        const {
            telephone,
            email,
            name,
            last_name,
            date_of_birth,
            address,
            postal_code,
            city,
            country,
            vat_number,
            driver_license,
            driver_license_country,
            passport,
            passport_country,
            company = false,
            company_name,
            flight,
            number_of_people,
            drivers = [],
            notes,
            acceptTerms,
        } = values;

        const payload = {
            // contact
            telephone,
            email,
            name,
            last_name,

            // dates
            date_of_birth: date_of_birth
                ? (dayjs.isDayjs(date_of_birth)
                    ? date_of_birth.format("YYYY-MM-DD")
                    : String(date_of_birth))
                : null,

            // age policy
            age,
            requires_extra_insurance: requiresExtraInsurance,

            // address
            address,
            postal_code,
            city,
            country,

            // company
            company: company,
            company_name: company ? company_name || null : null,
            vat_number: vat_number || null,

            // IDs / license (optional)
            driver_license: driver_license || null,
            driver_license_country: driver_license_country || null,
            passport: passport || null,
            passport_country: passport_country || null,

            // booking extras
            flight: flight || null,
            number_of_people:
                typeof number_of_people === "number"
                    ? number_of_people
                    : Number(number_of_people) || 1,

            // additional drivers
            drivers: Array.isArray(drivers)
                ? drivers
                    .map((d: any) => ({
                        telephone: d?.telephone ?? null,
                        name: d?.name ?? null,
                    }))
                    .filter((d: any) => d.telephone || d.name)
                : [],

            // notes
            notes: notes || null,

            // legal
            acceptTerms: !!acceptTerms,

            // optional UI language
            lang: isGreek ? "el" : "en",
        };

        try {
            await myApi.post("booking/createUser", payload);
            message.success(
                isGreek ? "Τα στοιχεία σας αποθηκεύτηκαν." : "Your details were saved."
            );
            onNext?.();
        } catch (e) {
            console.log(e);
            message.error(
                isGreek
                    ? "Αποτυχία αποθήκευσης στοιχείων. Προσπαθήστε ξανά."
                    : "Failed to save details. Please try again."
            );
        }
    };

    return (
        <div>
            {/* 1) Στοιχεία επικοινωνίας */}
            <Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
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
                        <Input placeholder="+30 69..." prefix={<PhoneOutlined />} />
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
                        <Input placeholder="name@example.com" prefix={<MailOutlined />} />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        name="name"
                        label="Όνομα"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε όνομα" }]}
                    >
                        <Input placeholder="Όνομα" prefix={<UserOutlined />} />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        name="last_name"
                        label="Επώνυμο"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε επώνυμο" }]}
                    >
                        <Input placeholder="Επώνυμο" prefix={<UserOutlined />} />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        name="date_of_birth"
                        label="Ημερομηνία γέννησης"
                        rules={[
                            { required: true, message: "Παρακαλώ επιλέξτε ημερομηνία γέννησης" },
                            // Disallow <21 or >72
                            {
                                validator: (_, value) => {
                                    const a = calcAge(value);
                                    if (a === null) return Promise.resolve();
                                    if (a < 21 || a > 72) {
                                        return Promise.reject(
                                            new Error(
                                                isGreek
                                                    ? "Η ηλικία πρέπει να είναι από 21 έως 72."
                                                    : "Age must be between 21 and 72."
                                            )
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                        extra={
                            age !== null
                                ? isAgeBlocked
                                    ? (
                                        <Text type="danger">
                                            {isGreek
                                                ? "Δεν μπορείτε να προχωρήσετε (ηλικία εκτός ορίων 21–72)."
                                                : "You cannot proceed (age outside 21–72)."}
                                        </Text>
                                    )
                                    : requiresExtraInsurance
                                        ? (
                                            <Text type="warning">
                                                {isGreek
                                                    ? "Απαιτείται πρόσθετη ασφάλιση λόγω ηλικίας."
                                                    : "Extra insurance required due to age."}
                                            </Text>
                                        )
                                        : null
                                : null
                        }
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                            suffixIcon={<CalendarOutlined />}
                            disabledDate={(current) => !!current && current > dayjs().endOf("day")}
                        />
                    </Form.Item>
                </Col>

                {isGreek ? (
                    <Col xs={24} md={12}>
                        <Form.Item name="vat_number" label="ΑΦΜ" rules={[{ required: true, message: "Παρακαλώ εισάγετε ΑΦΜ" }]}>
                            <Input placeholder="π.χ. EL123456789" prefix={<NumberOutlined />} />
                        </Form.Item>
                    </Col>
                ) : null}
            </Row>

            {/* 2) Διεύθυνση */}
            <Title level={5} style={{ marginTop: 30 }}>
                Διεύθυνση
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="address"
                        label="Διεύθυνση"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε διεύθυνση" }]}
                    >
                        <Input placeholder="Οδός & αριθμός" prefix={<HomeOutlined />} />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="city"
                        label="Πόλη"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε πόλη" }]}
                    >
                        <Input placeholder="Πόλη" prefix={<EnvironmentOutlined />} />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="postal_code"
                        label="Ταχυδρομικός κώδικας"
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε ΤΚ" }]}
                    >
                        <Input placeholder="ΤΚ" prefix={<NumberOutlined />} />
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
                            suffixIcon={<GlobalOutlined />}
                        />
                    </Form.Item>
                </Col>
            </Row>

            {/* 3) Οδήγηση */}
            <Title level={5} style={{ marginTop: 30 }}>
                Οδήγηση
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item name="driver_license" label="Δίπλωμα οδήγησης">
                        <Input placeholder="Αριθμός διπλώματος" prefix={<IdcardOutlined />} />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="driver_license_country" label="Χώρα διπλώματος">
                        <Select
                            placeholder="Επιλέξτε χώρα"
                            options={countryOptions}
                            optionFilterProp="label"
                            showSearch
                            suffixIcon={<GlobalOutlined />}
                        />
                    </Form.Item>
                </Col>
            </Row>

            {/* 4) Ταυτότητα */}
            <Title level={5} style={{ marginTop: 30 }}>
                Διαβατήριο / Ταυτότητα
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item name="passport" label="Διαβατηρίο / Ταυτότητα">
                        <Input placeholder="Αριθμός διαβατηρίου / ταυτότητας" prefix={<IdcardOutlined />} />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="passport_country" label="Χώρα έκδοσης διαβατηρίου / ταυτότητας">
                        <Select
                            placeholder="Επιλέξτε χώρα"
                            options={countryOptions}
                            optionFilterProp="label"
                            showSearch
                            suffixIcon={<GlobalOutlined />}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider />

            {/* 5) Εταιρεία (προαιρετικό) */}
            <Title level={5} style={{ marginTop: 0 }}>
                Εταιρεία (προαιρετικό)
            </Title>

            <Row gutter={[16, 8]} align="middle">
                <Col xs={24} md={12}>
                    <Form.Item
                        name="company"
                        label={
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <BankOutlined />
                Τιμολόγιο σε εταιρεία;
              </span>
                        }
                        valuePropName="checked"
                        colon={false}
                    >
                        <Switch />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.company !== cur.company}>
                {({ getFieldValue }) =>
                    getFieldValue("company") ? (
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Form.Item name="company_name" label="Επωνυμία εταιρείας (προαιρετικό)">
                                    <Input placeholder="Επωνυμία" prefix={<ApartmentOutlined />} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="vat_number" label="ΑΦΜ (προαιρετικό)">
                                    <Input placeholder="π.χ. EL123456789" prefix={<NumberOutlined />} />
                                </Form.Item>
                            </Col>
                        </Row>
                    ) : null
                }
            </Form.Item>

            <Divider />

            {/* 6) Έξτρα στοιχεία κράτησης */}
            <Title level={5} style={{ marginTop: 30 }}>
                Έξτρα στοιχεία κράτησης
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item name="flight" label="Πτήση (προαιρετικό)">
                        <Input placeholder="π.χ. A3 123" prefix={<SendOutlined />} />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="number_of_people"
                        label={
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <UsergroupAddOutlined />
                Αριθμός ατόμων
              </span>
                        }
                        rules={[{ required: true, message: "Παρακαλώ εισάγετε αριθμό ατόμων" }]}
                    >
                        <InputNumber min={1} style={{ width: "100%" }} placeholder="1" />
                    </Form.Item>
                </Col>
            </Row>

            {/* Επιπλέον οδηγοί */}
            <div style={{ marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <TeamOutlined />
                    <Title level={5} style={{ margin: 0 }}>
                        Επιπλέον οδηγοί (προαιρετικό)
                    </Title>
                </div>

                <div
                    style={{
                        border: "1px solid #dfe7ff",
                        background: "#f7fbff",
                        borderRadius: 12,
                        boxShadow: "0 6px 18px rgba(47,90,255,0.07)",
                        padding: 12,
                    }}
                >
                    <Form.List name="drivers">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, idx) => (
                                    <div
                                        key={field.key}
                                        style={{
                                            position: "relative",
                                            border: "1px dashed #b9c8ff",
                                            background: "#fff",
                                            borderRadius: 10,
                                            padding: 12,
                                            marginBottom: 14,
                                            boxShadow: "0 4px 12px rgba(47,90,255,0.05)",
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Text type="secondary">Οδηγός #{idx + 2}</Text>
                                            <Button
                                                type="text"
                                                danger
                                                shape="circle"
                                                icon={<CloseOutlined />}
                                                onClick={() => remove(field.name)}
                                                aria-label="Αφαίρεση οδηγού"
                                            />
                                        </div>

                                        <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
                                            <Col span={24}>
                                                <Form.Item
                                                    name={[field.name, "telephone"]}
                                                    label="Τηλέφωνο οδηγού"
                                                    rules={[{ required: true, message: "Παρακαλώ εισάγετε τηλέφωνο οδηγού" }]}
                                                >
                                                    <Input placeholder="Τηλέφωνο οδηγού" prefix={<PhoneOutlined />} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item
                                                    name={[field.name, "name"]}
                                                    label="Όνομα οδηγού"
                                                    rules={[{ required: true, message: "Παρακαλώ εισάγετε όνομα οδηγού" }]}
                                                >
                                                    <Input placeholder="Όνομα οδηγού" prefix={<UserOutlined />} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}

                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Προσθήκη οδηγού
                                </Button>
                            </>
                        )}
                    </Form.List>
                </div>
            </div>

            <Form.Item name="notes" label="Σημειώσεις (προαιρετικό)" style={{ marginTop: 30 }}>
                <Input.TextArea rows={3} placeholder="Οδηγίες παράδοσης, ειδικές ανάγκες κ.λπ." />
            </Form.Item>

            <Form.Item
                name="acceptTerms"
                valuePropName="checked"
                rules={[
                    {
                        validator: (_, v) =>
                            v
                                ? Promise.resolve()
                                : Promise.reject(
                                    new Error(
                                        isGreek
                                            ? "Παρακαλώ αποδεχτείτε τους Όρους & Προϋποθέσεις"
                                            : "Please accept the Terms & Conditions"
                                    )
                                ),
                    },
                ]}
                style={{ marginTop: 20 }}
            >
                <Checkbox>
                    {isGreek ? "Αποδέχομαι τους " : "I accept the "}
                    <a href={termsHref} target="_blank" rel="noopener noreferrer">
                        {isGreek ? "Όρους & Προϋποθέσεις" : "Terms & Conditions"}
                    </a>
                </Checkbox>
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
                <Space>
                    <Button onClick={onPrev}>ΠΙΣΩ</Button>
                </Space>
                <Space>
                    <Button
                        type="primary"
                        onClick={handleNext}
                        disabled={!accepted || isAgeBlocked}
                    >
                        ΟΛΟΚΛΗΡΩΣΗ & ΠΛΗΡΩΜΗ
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default MyInfo;
