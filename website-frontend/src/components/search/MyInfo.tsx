// src/components/search/MyInfo.tsx
import React from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
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
    Tooltip,
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
    UnlockOutlined,
    CheckCircleTwoTone,
    LoadingOutlined,
    EditOutlined,
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

type FilledMap = {
    date_of_birth?: boolean;
    address?: boolean;
    postal_code?: boolean;
    city?: boolean;
    country?: boolean;
    vat_number?: boolean;
    driver_license?: boolean;
    driver_license_country?: boolean;
    passport?: boolean;
    passport_country?: boolean;
    company?: boolean;
    company_name?: boolean;
    name?: boolean;
    last_name?: boolean;
    email?: boolean;
};

const MyInfo: React.FC<Props> = ({
                                     form,
                                     onPrev,
                                     onNext,
                                     countryOptions = DEFAULT_COUNTRIES,
                                 }) => {
    const isGreek = /^\/el(\/|$)/i.test(location.pathname);
    const termsHref = isGreek ? "/el/terms" : "/terms";

    const [checking, setChecking] = React.useState(false);
    const [verified, setVerified] = React.useState(false);
    const [filled, setFilled] = React.useState<FilledMap>({});
    const [forceShowAll, setForceShowAll] = React.useState(false);
    const [warnNoUser, setWarnNoUser] = React.useState(false);

    // watch login fields to reset state
    const telLocal = Form.useWatch("telephone", form);
    const cc = Form.useWatch("cc", form);
    const emailVal = Form.useWatch("email", form);
    React.useEffect(() => {
        setVerified(false);
        setFilled({});
        setForceShowAll(false);
        setWarnNoUser(false);
    }, [telLocal, emailVal, cc]);

    const accepted = Form.useWatch<boolean>("acceptTerms", form) ?? false;
    const dob = Form.useWatch("date_of_birth", form);

    // age helpers
    const calcAge = (v: any): number | null => {
        if (!v) return null;
        const d = dayjs.isDayjs(v) ? v : dayjs(v);
        if (!d.isValid()) return null;
        return dayjs().diff(d, "year");
    };
    const age = calcAge(dob);
    const requiresExtraInsurance =
        age !== null && ((age >= 21 && age <= 23) || (age >= 65 && age <= 72));
    const isAgeBlocked = age !== null && (age < 21 || age > 72);

    const isVisible = (key: keyof FilledMap) => {
        if (!verified) return true;
        if (forceShowAll && (key === "last_name" || key === "name")) return true;
        return !filled[key];
    };

    // build +<cc><local10>
    const buildFullTelephone = (): string => {
        const cc2 = (form.getFieldValue("cc") || "").toString().trim(); // 2 digits
        const local = (form.getFieldValue("telephone") || "").toString().trim(); // 10 digits
        return `+${cc2}${local}`;
    };

    const verifyDetails = async () => {
        try {
            await form.validateFields(["cc", "telephone", "email"]);
        } catch {
            return;
        }
        //const telFull = buildFullTelephone();
        const eml = form.getFieldValue("email");
        const tel = form.getFieldValue("telephone");

        if (!tel || !eml) return;

        setChecking(true);
        try {
            const { data } = await myApi.get(
                `user/checkUser/${encodeURIComponent(String(tel))}`,
                { params: { email: eml } }
            );

            if (!data) {
                setVerified(false);
                setFilled({});
                setWarnNoUser(true);
                message.warning(
                    isGreek
                        ? "Δεν βρέθηκε λογαριασμός. Συνεχίστε με συμπλήρωση των πεδίων."
                        : "No saved profile found. Please fill in your details."
                );
                return;
            }

            setWarnNoUser(false);

            const prefill: Record<string, any> = {};
            if (data?.name) prefill.name = data.name;
            if (data?.last_name) prefill.last_name = data.last_name;
            if (data?.email) prefill.email = data.email;
            form.setFieldsValue(prefill);

            const nextFilled: FilledMap = {
                date_of_birth: !!data?.dateOfBirth,
                address: !!data?.address,
                postal_code: !!data?.postal_code,
                city: !!data?.city,
                country: !!data?.country,
                vat_number: !!data?.vat_number,
                driver_license: !!data?.driver_license,
                driver_license_country: !!data?.driver_license_country,
                passport: !!data?.passport,
                passport_country: !!data?.passport_country,
                company: !!data?.company,
                company_name: !!data?.company_name,
                name: !!data?.name,
                last_name: !!data?.last_name,
                email: !!data?.email,
            };
            setFilled(nextFilled);
            setVerified(true);

            message.success(
                isGreek
                    ? "Επιτυχής αναγνώριση — τώρα εμφανίζονται μόνο τα πεδία που λείπουν."
                    : "Verified — now only missing fields are shown."
            );
        } catch (e) {
            console.error(e);
            setVerified(false);
            setFilled({});
            setWarnNoUser(true);
            message.warning(
                isGreek
                    ? "Δεν βρέθηκε λογαριασμός. Συνεχίστε με συμπλήρωση των πεδίων."
                    : "No saved profile found. Please fill in your details."
            );
        } finally {
            setChecking(false);
        }
    };

    const handleNext = async () => {
        await form.validateFields();
        if (isAgeBlocked) {
            return message.error(
                isGreek
                    ? "Δεν μπορείτε να προχωρήσετε. Η ηλικία πρέπει να είναι από 21 έως 72."
                    : "You cannot proceed. Age must be between 21 and 72."
            );
        }

        const values = form.getFieldsValue(true) as any;
        const {
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

        const telephone = buildFullTelephone();

        const payload = {
            telephone,
            email,
            name,
            last_name,
            dateOfBirth: date_of_birth
                ? (dayjs.isDayjs(date_of_birth)
                    ? date_of_birth.format("YYYY-MM-DD")
                    : String(date_of_birth))
                : null,
            age,
            requires_extra_insurance: requiresExtraInsurance,
            address,
            postal_code,
            city,
            country,
            company: company,
            company_name: company ? company_name || null : null,
            vat_number: vat_number || null,
            driver_license: driver_license || null,
            driver_license_country: driver_license_country || null,
            passport: passport || null,
            passport_country: passport_country || null,
            flight: flight || null,
            number_of_people:
                typeof number_of_people === "number"
                    ? number_of_people
                    : Number(number_of_people) || 1,
            drivers: Array.isArray(drivers)
                ? drivers
                    .map((d: any) => ({
                        telephone: d?.telephone ?? null,
                        name: d?.name ?? null,
                    }))
                    .filter((d: any) => d.telephone || d.name)
                : [],
            notes: notes || null,
            acceptTerms: !!acceptTerms,
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

    // --- input sanitizers (updated for 10 digits local) ---
    const handlePhoneChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const digitsOnly = e.target.value.replace(/\D+/g, "").slice(0, 10);
        form.setFieldsValue({ telephone: digitsOnly });
    };
    const handleCcChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const digitsOnly = e.target.value.replace(/\D+/g, "").slice(0, 2);
        form.setFieldsValue({ cc: digitsOnly });
    };

    return (
        <div>
            {/* LOGIN-LIKE HEADER */}
            <Card
                style={{ borderRadius: 14, marginBottom: 18, border: "1px solid #E6E9F5" }}
                bodyStyle={{ padding: 16 }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <UnlockOutlined style={{ color: "#2F5AFF" }} />
                    <Title level={5} style={{ margin: 0 }}>
                        {isGreek ? "Σύνδεση για αυτόματη συμπλήρωση" : "Sign in to auto-fill"}
                    </Title>
                    {verified ? (
                        <Badge
                            count={
                                <Space size={4}>
                                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                                    <span>{isGreek ? "Επιβεβαιώθηκε" : "Verified"}</span>
                                </Space>
                            }
                            style={{ background: "transparent" }}
                        />
                    ) : null}
                </div>

                <Row gutter={[12, 12]}>
                    <Col xs={24} md={10}>
                        <Form.Item
                            name="telephone"
                            label={isGreek ? "Τηλέφωνο" : "Phone"}
                            rules={[
                                { required: true, message: isGreek ? "Υποχρεωτικό" : "Required" },
                                { pattern: /^\d{10}$/, message: isGreek ? "Εισάγετε ακριβώς 10 ψηφία." : "Enter exactly 10 digits." },
                            ]}
                            extra={
                                <Text type="secondary">
                                    {isGreek
                                        ? "Κωδικός χώρας (2 ψηφία) και τοπικό τηλέφωνο (10 ψηφία)."
                                        : "Country code (2 digits) + local number (10 digits)."}
                                </Text>
                            }
                        >
                            <Input
                                size="large"
                                placeholder="1234567890"
                                prefix={<PhoneOutlined />}
                                inputMode="numeric"
                                maxLength={10}
                                onChange={handlePhoneChange}
                                disabled={checking}
                                addonBefore={
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            padding: "0 6px",
                                            minWidth: 76,                 // <-- wider prefix area
                                            justifyContent: "center",
                                        }}
                                    >
                                        <span style={{ fontWeight: 700, fontSize: 16 }}>+</span>
                                        <Form.Item
                                            name="cc"
                                            noStyle
                                            initialValue="30"
                                            rules={[
                                                { required: true, message: isGreek ? "Κωδικός χώρας" : "Country code" },
                                                { pattern: /^\d{2}$/, message: isGreek ? "2 ψηφία" : "2 digits" },
                                            ]}
                                        >
                                            <Input
                                                inputMode="numeric"
                                                maxLength={2}
                                                onChange={handleCcChange}
                                                style={{ width: 48, textAlign: "center", fontWeight: 600 }} // <-- wider CC box
                                                placeholder="30"
                                            />
                                        </Form.Item>
                                    </div>
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={10}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: isGreek ? "Υποχρεωτικό" : "Required" },
                                { type: "email", message: isGreek ? "Μη έγκυρο" : "Invalid" },
                            ]}
                        >
                            <Input size="large" placeholder="name@example.com" prefix={<MailOutlined />} disabled={checking} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={4} style={{ display: "flex", alignItems: "flex-end" }}>
                        <Space.Compact style={{ width: "100%" }}>
                            <Button
                                type="primary"
                                size="large"
                                onClick={verifyDetails}
                                icon={checking ? <LoadingOutlined /> : <UnlockOutlined />}
                                block
                            >
                                {isGreek ? "Συνέχεια" : "Continue"}
                            </Button>
                            {verified && (
                                <Tooltip title={isGreek ? "Επεξεργασία στοιχείων εισόδου" : "Edit login fields"}>
                                    <Button
                                        size="large"
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            setVerified(false);
                                            setForceShowAll(false);
                                            message.info(
                                                isGreek
                                                    ? "Τροποποιήστε τηλέφωνο/email και πατήστε Συνέχεια."
                                                    : "Edit phone/email and press Continue."
                                            );
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Space.Compact>
                    </Col>
                </Row>

                {warnNoUser && (
                    <Alert
                        type="warning"
                        showIcon
                        style={{ marginTop: 6 }}
                        message={isGreek ? "Δεν βρέθηκε λογαριασμός με αυτά τα στοιχεία." : "No account found with those details."}
                        description={
                            <Text type="secondary">
                                {isGreek
                                    ? "Συνεχίστε συμπληρώνοντας τα παρακάτω πεδία για να δημιουργήσουμε νέο προφίλ μαζί με την κράτηση."
                                    : "Please continue filling in the fields below to create a new profile with your booking."}
                            </Text>
                        }
                    />
                )}

                {verified && (
                    <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
                        <Text type="secondary">
                            {isGreek ? "Εμφανίζονται μόνο τα πεδία που λείπουν." : "Only missing fields are shown."}
                        </Text>
                        <Button
                            type={forceShowAll ? "primary" : "default"}
                            onClick={() => setForceShowAll((s) => !s)}
                            size="small"
                        >
                            {forceShowAll ? (isGreek ? "Απόκρυψη Ονόματος" : "Show missing only") : (isGreek ? "Εμφάνιση Ονόματος" : "Show all")}
                        </Button>
                    </div>
                )}
            </Card>

            {/* BASIC IDENTITY */}
            <Row gutter={[16, 16]}>
                {isVisible("name") && (
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="name"
                            label={isGreek ? "Όνομα" : "First name"}
                            rules={[{ required: true, message: isGreek ? "Υποχρεωτικό" : "Required" }]}
                        >
                            <Input placeholder={isGreek ? "Όνομα" : "First name"} prefix={<UserOutlined />} />
                        </Form.Item>
                    </Col>
                )}

                {isVisible("last_name") && (
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="last_name"
                            label={isGreek ? "Επώνυμο" : "Last name"}
                            rules={[{ required: true, message: isGreek ? "Υποχρεωτικό" : "Required" }]}
                        >
                            <Input placeholder={isGreek ? "Επώνυμο" : "Last name"} prefix={<UserOutlined />} />
                        </Form.Item>
                    </Col>
                )}

                {isVisible("date_of_birth") && (
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="date_of_birth"
                            label={isGreek ? "Ημερομηνία γέννησης" : "Date of birth"}
                            rules={[
                                { required: true, message: isGreek ? "Υποχρεωτικό" : "Required" },
                                {
                                    validator: (_, value) => {
                                        const a = calcAge(value);
                                        if (a === null) return Promise.resolve();
                                        if (a < 21 || a > 72) {
                                            return Promise.reject(new Error(isGreek ? "Ηλικία 21–72" : "Age must be 21–72"));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            extra={
                                (() => {
                                    if (age === null) return null;
                                    if (isAgeBlocked)
                                        return <Text type="danger">{isGreek ? "Εκτός ορίων ηλικίας (21–72)." : "Age outside 21–72."}</Text>;
                                    if (requiresExtraInsurance)
                                        return <Text type="warning">{isGreek ? "Απαιτείται πρόσθετη ασφάλιση." : "Extra insurance required."}</Text>;
                                    return null;
                                })()
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
                )}

                {isGreek && isVisible("vat_number") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="vat_number" label="ΑΦΜ" rules={[{ required: true, message: "Υποχρεωτικό" }]}>
                            <Input placeholder="π.χ. EL123456789" prefix={<NumberOutlined />} />
                        </Form.Item>
                    </Col>
                )}
            </Row>

            {/* ADDRESS */}
            <Title level={5} style={{ marginTop: 24 }}>{isGreek ? "Διεύθυνση" : "Address"}</Title>
            <Row gutter={[16, 16]}>
                {isVisible("address") && (
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="address"
                            label={isGreek ? "Διεύθυνση" : "Address"}
                            rules={[{ required: true, message: isGreek ? "Υποχρεωτικό" : "Required" }]}
                        >
                            <Input placeholder={isGreek ? "Οδός & αριθμός" : "Street & number"} prefix={<HomeOutlined />} />
                        </Form.Item>
                    </Col>
                )}
                {isVisible("city") && (
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="city"
                            label={isGreek ? "Πόλη" : "City"}
                            rules={[{ required: true, message: isGreek ? "Υποχρεωτικό" : "Required" }]}
                        >
                            <Input placeholder={isGreek ? "Πόλη" : "City"} prefix={<EnvironmentOutlined />} />
                        </Form.Item>
                    </Col>
                )}
                {isVisible("postal_code") && (
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="postal_code"
                            label={isGreek ? "Τ.Κ." : "Postal code"}
                            rules={[{ required: true, message: isGreek ? "Υποχρεωτικό" : "Required" }]}
                        >
                            <Input placeholder={isGreek ? "ΤΚ" : "ZIP"} prefix={<NumberOutlined />} />
                        </Form.Item>
                    </Col>
                )}
                {isVisible("country") && (
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="country"
                            label={isGreek ? "Χώρα" : "Country"}
                            rules={[{ required: true, message: isGreek ? "Υποχρεωτικό" : "Required" }]}
                        >
                            <Select
                                placeholder={isGreek ? "Επιλέξτε χώρα" : "Select country"}
                                options={countryOptions}
                                optionFilterProp="label"
                                showSearch
                                suffixIcon={<GlobalOutlined />}
                            />
                        </Form.Item>
                    </Col>
                )}
            </Row>

            {/* DRIVING */}
            <Title level={5} style={{ marginTop: 24 }}>{isGreek ? "Οδήγηση" : "Driving"}</Title>
            <Row gutter={[16, 16]}>
                {isVisible("driver_license") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="driver_license" label={isGreek ? "Δίπλωμα οδήγησης" : "Driver's license"}>
                            <Input placeholder={isGreek ? "Αριθμός διπλώματος" : "License number"} prefix={<IdcardOutlined />} />
                        </Form.Item>
                    </Col>
                )}
                {isVisible("driver_license_country") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="driver_license_country" label={isGreek ? "Χώρα διπλώματος" : "License country"}>
                            <Select
                                placeholder={isGreek ? "Επιλέξτε χώρα" : "Select country"}
                                options={countryOptions}
                                optionFilterProp="label"
                                showSearch
                                suffixIcon={<GlobalOutlined />}
                            />
                        </Form.Item>
                    </Col>
                )}
            </Row>

            {/* IDENTITY */}
            <Title level={5} style={{ marginTop: 24 }}>{isGreek ? "Διαβατήριο / Ταυτότητα" : "Passport / ID"}</Title>
            <Row gutter={[16, 16]}>
                {isVisible("passport") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="passport" label={isGreek ? "Διαβατήριο / Ταυτότητα" : "Passport / ID"}>
                            <Input placeholder={isGreek ? "Αριθμός" : "Number"} prefix={<IdcardOutlined />} />
                        </Form.Item>
                    </Col>
                )}
                {isVisible("passport_country") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="passport_country" label={isGreek ? "Χώρα έκδοσης" : "Issuing country"}>
                            <Select
                                placeholder={isGreek ? "Επιλέξτε χώρα" : "Select country"}
                                options={countryOptions}
                                optionFilterProp="label"
                                showSearch
                                suffixIcon={<GlobalOutlined />}
                            />
                        </Form.Item>
                    </Col>
                )}
            </Row>

            <Divider />

            {/* COMPANY */}
            <Title level={5} style={{ marginTop: 0 }}>{isGreek ? "Εταιρεία (προαιρετικό)" : "Company (optional)"}</Title>
            {isVisible("company") && (
                <>
                    <Row gutter={[16, 8]} align="middle">
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="company"
                                label={
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <BankOutlined />
                                        {isGreek ? "Τιμολόγιο σε εταιρεία;" : "Invoice to company?"}
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
                                    {isVisible("company_name") && (
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="company_name"
                                                label={isGreek ? "Επωνυμία (προαιρετικό)" : "Company name (optional)"}
                                            >
                                                <Input placeholder={isGreek ? "Επωνυμία" : "Company name"} prefix={<ApartmentOutlined />} />
                                            </Form.Item>
                                        </Col>
                                    )}
                                    {isVisible("vat_number") && (
                                        <Col xs={24} md={12}>
                                            <Form.Item name="vat_number" label="VAT">
                                                <Input placeholder="EL123456789" prefix={<NumberOutlined />} />
                                            </Form.Item>
                                        </Col>
                                    )}
                                </Row>
                            ) : null
                        }
                    </Form.Item>
                </>
            )}

            <Divider />

            {/* BOOKING EXTRAS */}
            <Title level={5} style={{ marginTop: 24 }}>{isGreek ? "Έξτρα στοιχεία κράτησης" : "Booking extras"}</Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item name="flight" label={isGreek ? "Πτήση (προαιρετικό)" : "Flight (optional)"}>
                        <Input placeholder={isGreek ? "π.χ. A3 123" : "e.g. A3 123"} prefix={<SendOutlined />} />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="number_of_people"
                        label={
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <UsergroupAddOutlined />
                                {isGreek ? "Αριθμός ατόμων" : "Number of people"}
              </span>
                        }
                        rules={[{ required: true, message: isGreek ? "Υποχρεωτικό" : "Required" }]}
                    >
                        <InputNumber min={1} style={{ width: "100%" }} placeholder="1" />
                    </Form.Item>
                </Col>
            </Row>

            {/* EXTRA DRIVERS */}
            <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <TeamOutlined />
                    <Title level={5} style={{ margin: 0 }}>
                        {isGreek ? "Επιπλέον οδηγοί (προαιρετικό)" : "Additional drivers (optional)"}
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
                                            <Text type="secondary">{isGreek ? `Οδηγός #${idx + 2}` : `Driver #${idx + 2}`}</Text>
                                            <Button
                                                type="text"
                                                danger
                                                shape="circle"
                                                icon={<CloseOutlined />}
                                                onClick={() => remove(field.name)}
                                                aria-label={isGreek ? "Αφαίρεση οδηγού" : "Remove driver"}
                                            />
                                        </div>

                                        <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
                                            <Col span={24}>
                                                <Form.Item
                                                    name={[field.name, "telephone"]}
                                                    label={isGreek ? "Τηλέφωνο οδηγού" : "Driver phone"}
                                                    rules={[{ required: true, message: isGreek ? "Υποχρεωτικό" : "Required" }]}
                                                >
                                                    <Input placeholder={isGreek ? "Τηλέφωνο" : "Phone"} prefix={<PhoneOutlined />} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item
                                                    name={[field.name, "name"]}
                                                    label={isGreek ? "Όνομα οδηγού" : "Driver name"}
                                                    rules={[{ required: true, message: isGreek ? "Υποχρεωτικό" : "Required" }]}
                                                >
                                                    <Input placeholder={isGreek ? "Όνομα" : "Name"} prefix={<UserOutlined />} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}

                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    {isGreek ? "Προσθήκη οδηγού" : "Add driver"}
                                </Button>
                            </>
                        )}
                    </Form.List>
                </div>
            </div>

            <Form.Item name="notes" label={isGreek ? "Σημειώσεις (προαιρετικό)" : "Notes (optional)"} style={{ marginTop: 24 }}>
                <Input.TextArea
                    rows={3}
                    placeholder={isGreek ? "Οδηγίες, ειδικές ανάγκες κ.λπ." : "Delivery notes, special needs, etc."}
                />
            </Form.Item>

            {/* TERMS */}
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
                style={{ marginTop: 12 }}
            >
                <Checkbox>
                    {isGreek ? "Αποδέχομαι τους " : "I accept the "}
                    <a href={termsHref} target="_blank" rel="noopener noreferrer">
                        {isGreek ? "Όρους & Προϋποθέσεις" : "Terms & Conditions"}
                    </a>
                </Checkbox>
            </Form.Item>

            {/* FOOTER ACTIONS */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <Space>
                    <Button onClick={onPrev}>{isGreek ? "ΠΙΣΩ" : "BACK"}</Button>
                </Space>
                <Space>
                    <Button
                        type="primary"
                        onClick={handleNext}
                        disabled={!accepted || isAgeBlocked}
                        icon={<CheckCircleTwoTone twoToneColor="#ffffff" />}
                    >
                        {isGreek ? "ΟΛΟΚΛΗΡΩΣΗ & ΠΛΗΡΩΜΗ" : "COMPLETE & PAY"}
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default MyInfo;
