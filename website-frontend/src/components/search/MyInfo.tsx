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
import { withLang } from "../../resources/useLangRouter.ts";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

type CountryOption = { label: string; value: string };

type Props = {
    form: FormInstance;
    onPrev?: () => void;
    onNext?: () => void;
    countryOptions?: CountryOption[];
};

const DEFAULT_COUNTRIES: CountryOption[] = [
    { value: "GR", label: "Ελλάδα" },
    { value: "DE", label: "Γερμανία" },
    { value: "FR", label: "Γαλλία" },
    { value: "IT", label: "Ιταλία" },
    { value: "GB", label: "Ηνωμένο Βασίλειο" },
    { value: "US", label: "Ηνωμένες Πολιτείες" },
    { value: "OTHER", label: "Άλλη" },
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

    const [checking, setChecking] = React.useState(false);
    const [verified, setVerified] = React.useState(false);
    const [filled, setFilled] = React.useState<FilledMap>({});
    const [forceShowAll, setForceShowAll] = React.useState(false);
    const [warnNoUser, setWarnNoUser] = React.useState(false);
    const { t } = useTranslation("booking");

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

    const verifyDetails = async () => {
        try {
            await form.validateFields(["cc", "telephone", "email"]);
        } catch {
            return;
        }
        const eml = form.getFieldValue("email");
        const tel = form.getFieldValue("telephone");
        const cc = form.getFieldValue("cc");
        if (!tel || !eml) return;

        setChecking(true);
        try {
            const { data } = await myApi.get(
                `user/checkUser/${encodeURIComponent(String(tel))}`,
                { params: { email: eml, cc: cc } }
            );

            if (!data) {
                setVerified(false);
                setFilled({});
                setWarnNoUser(true);
                message.warning(t("info.messages.userNotFound"));
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

            message.success(t("info.messages.recognized"));
        } catch (e) {
            console.error(e);
            setVerified(false);
            setFilled({});
            setWarnNoUser(true);
            message.error(t("info.messages.emailMismatch"));
        } finally {
            setChecking(false);
        }
    };

    const handleNext = async () => {
        await form.validateFields();
        if (isAgeBlocked) {
            return message.error(t("info.validation.ageBlocked"));
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

        const cc = (form.getFieldValue("cc") || "").toString().trim(); // 2 digits
        const telephone = (form.getFieldValue("telephone") || "").toString().trim(); // 10 digits

        const payload = {
            telephone,
            cc,
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
            lang: "el",
        };

        try {
            await myApi.post("booking/createUser", payload);
            message.success(t("info.messages.saved"));
            onNext?.();
        } catch (e) {
            console.log(e);
            message.error(t("info.messages.saveFailed"));
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
                        {t("info.login.title")}
                    </Title>
                    {verified ? (
                        <Badge
                            count={
                                <Space size={4}>
                                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                                    <span>{t("info.login.verified")}</span>
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
                            label={t("info.fields.telephone.label")}
                            rules={[
                                { required: true, message: t("info.common.required") },
                                { pattern: /^\d{10}$/, message: t("info.fields.telephone.tenDigits") },
                            ]}
                            extra={
                                <Text type="secondary">
                                    {t("info.fields.telephone.extra")}
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
                                            minWidth: 76,
                                            justifyContent: "center",
                                        }}
                                    >
                                        <span style={{ fontWeight: 700, fontSize: 16 }}>+</span>
                                        <Form.Item
                                            name="cc"
                                            noStyle
                                            initialValue="30"
                                            rules={[
                                                { required: true, message: t("info.fields.cc.label") },
                                                { pattern: /^\d{2}$/, message: t("info.fields.cc.twoDigits") },
                                            ]}
                                        >
                                            <Input
                                                inputMode="numeric"
                                                maxLength={2}
                                                onChange={handleCcChange}
                                                style={{ width: 48, textAlign: "center", fontWeight: 600 }}
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
                                { required: true, message: t("info.common.required") },
                                { type: "email", message: t("info.common.invalid") },
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
                                {t("info.login.continue")}
                            </Button>
                            {verified && (
                                <Tooltip title={t("info.login.editTooltip")}>
                                    <Button
                                        size="large"
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            setVerified(false);
                                            setForceShowAll(false);
                                            message.info(t("info.login.editHint"));
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
                        message={t("info.messages.userNotFoundShort")}
                        description={
                            <Text type="secondary">
                                {t("info.messages.userNotFoundDesc")}
                            </Text>
                        }
                    />
                )}

                {verified && (
                    <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
                        <Text type="secondary">{t("info.login.showingMissing")}</Text>
                        <Button
                            type={forceShowAll ? "primary" : "default"}
                            onClick={() => setForceShowAll((s) => !s)}
                            size="small"
                        >
                            {forceShowAll ? t("info.login.showMissingOnly") : t("info.login.showAll")}
                        </Button>
                    </div>
                )}
            </Card>

            {/* BASIC IDENTITY */}
            <Row gutter={[16, 16]}>
                {isVisible("name") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="name" label={t("info.fields.name")} rules={[{ required: true, message: t("info.common.required") }]}>
                            <Input placeholder={t("info.fields.name")} prefix={<UserOutlined />} />
                        </Form.Item>
                    </Col>
                )}

                {isVisible("last_name") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="last_name" label={t("info.fields.lastName")} rules={[{ required: true, message: t("info.common.required") }]}>
                            <Input placeholder={t("info.fields.lastName")} prefix={<UserOutlined />} />
                        </Form.Item>
                    </Col>
                )}

                {isVisible("date_of_birth") && (
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="date_of_birth"
                            label={t("info.fields.dob")}
                            rules={[
                                { required: true, message: t("info.common.required") },
                                {
                                    validator: (_, value) => {
                                        const a = calcAge(value);
                                        if (a === null) return Promise.resolve();
                                        if (a < 21 || a > 72) {
                                            return Promise.reject(new Error(t("info.validation.ageRange")));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            extra={
                                (() => {
                                    if (age === null) return null;
                                    if (isAgeBlocked) return <Text type="danger">{t("info.validation.ageOutOfRange")}</Text>;
                                    if (requiresExtraInsurance) return <Text type="warning">{t("info.validation.extraInsurance")}</Text>;
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

                {isVisible("vat_number") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="vat_number" label={t("info.fields.vat")} rules={[{ required: true, message: t("info.common.required") }]}>
                            <Input placeholder="π.χ. EL123456789" prefix={<NumberOutlined />} />
                        </Form.Item>
                    </Col>
                )}
            </Row>

            {/* ADDRESS */}
            <Title level={5} style={{ marginTop: 24 }}>{t("info.sections.address")}</Title>
            <Row gutter={[16, 16]}>
                {isVisible("address") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="address" label={t("info.fields.address")} rules={[{ required: true, message: t("info.common.required") }]}>
                            <Input placeholder={t("info.placeholders.street")} prefix={<HomeOutlined />} />
                        </Form.Item>
                    </Col>
                )}
                {isVisible("city") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="city" label={t("info.fields.city")} rules={[{ required: true, message: t("info.common.required") }]}>
                            <Input placeholder={t("info.fields.city")} prefix={<EnvironmentOutlined />} />
                        </Form.Item>
                    </Col>
                )}
                {isVisible("postal_code") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="postal_code" label={t("info.fields.postal")} rules={[{ required: true, message: t("info.common.required") }]}>
                            <Input placeholder={t("info.placeholders.postal")} prefix={<NumberOutlined />} />
                        </Form.Item>
                    </Col>
                )}
                {isVisible("country") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="country" label={t("info.fields.country")} rules={[{ required: true, message: t("info.common.required") }]}>
                            <Select
                                placeholder={t("info.placeholders.selectCountry")}
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
            <Title level={5} style={{ marginTop: 24 }}>{t("info.sections.driving")}</Title>
            <Row gutter={[16, 16]}>
                {isVisible("driver_license") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="driver_license" label={t("info.fields.license")}>
                            <Input placeholder={t("info.placeholders.licenseNo")} prefix={<IdcardOutlined />} />
                        </Form.Item>
                    </Col>
                )}
                {isVisible("driver_license_country") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="driver_license_country" label={t("info.fields.licenseCountry")}>
                            <Select
                                placeholder={t("info.placeholders.selectCountry")}
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
            <Title level={5} style={{ marginTop: 24 }}>{t("info.sections.identity")}</Title>
            <Row gutter={[16, 16]}>
                {isVisible("passport") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="passport" label={t("info.fields.passport")}>
                            <Input placeholder={t("info.placeholders.number")} prefix={<IdcardOutlined />} />
                        </Form.Item>
                    </Col>
                )}
                {isVisible("passport_country") && (
                    <Col xs={24} md={12}>
                        <Form.Item name="passport_country" label={t("info.fields.passportCountry")}>
                            <Select
                                placeholder={t("info.placeholders.selectCountry")}
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
            <Title level={5} style={{ marginTop: 0 }}>{t("info.sections.companyOptional")}</Title>
            {isVisible("company") && (
                <>
                    <Row gutter={[16, 8]} align="middle">
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="company"
                                label={
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <BankOutlined />
                                        {t("info.fields.invoiceCompany")}
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
                                            <Form.Item name="company_name" label={t("info.fields.companyNameOptional")}>
                                                <Input placeholder={t("info.fields.companyName")} prefix={<ApartmentOutlined />} />
                                            </Form.Item>
                                        </Col>
                                    )}
                                    {isVisible("vat_number") && (
                                        <Col xs={24} md={12}>
                                            <Form.Item name="vat_number" label={t("info.fields.vat")}>
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
            <Title level={5} style={{ marginTop: 24 }}>{t("info.sections.bookingExtras")}</Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item name="flight" label={t("info.fields.flightOptional")}>
                        <Input placeholder="π.χ. A3 123" prefix={<SendOutlined />} />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="number_of_people"
                        label={
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <UsergroupAddOutlined />
                                {t("info.fields.peopleCount")}
              </span>
                        }
                        rules={[{ required: true, message: t("info.common.required") }]}
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
                        {t("info.sections.extraDriversOptional")}
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
                                            <Text type="secondary">{`Οδηγός #${idx + 2}`}</Text>
                                            <Button
                                                type="text"
                                                danger
                                                shape="circle"
                                                icon={<CloseOutlined />}
                                                onClick={() => remove(field.name)}
                                                aria-label={t("info.drivers.remove")}
                                            />
                                        </div>

                                        <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
                                            <Col span={24}>
                                                <Form.Item
                                                    name={[field.name, "telephone"]}
                                                    label={t("info.drivers.driverPhone")}
                                                    rules={[{ required: true, message: t("info.common.required") }]}
                                                >
                                                    <Input placeholder={t("info.placeholders.phone")} prefix={<PhoneOutlined />} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item
                                                    name={[field.name, "name"]}
                                                    label={t("info.drivers.driverName")}
                                                    rules={[{ required: true, message: t("info.common.required") }]}
                                                >
                                                    <Input placeholder={t("info.fields.name")} prefix={<UserOutlined />} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}

                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    {t("info.drivers.addDriver")}
                                </Button>
                            </>
                        )}
                    </Form.List>
                </div>
            </div>

            <Form.Item name="notes" label={t("info.fields.notesOptional")} style={{ marginTop: 24 }}>
                <Input.TextArea rows={3} placeholder={t("info.placeholders.notes")} />
            </Form.Item>

            {/* TERMS */}
            <Form.Item
                name="acceptTerms"
                valuePropName="checked"
                rules={[{
                    validator: (_, v) =>
                        v ? Promise.resolve() : Promise.reject(new Error(t("info.validation.acceptTerms"))),
                }]}
                style={{ marginTop: 12 }}
            >
                <Checkbox>
                    {t("info.terms.accept")}{" "}
                    <a
                        href={withLang("/epikoinonia/oroi-kai-proipotheseis")}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t("info.terms.link")}
                    </a>
                </Checkbox>
            </Form.Item>


            {/* FOOTER ACTIONS */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <Space>
                    <Button onClick={onPrev}>{t("info.actions.back")}</Button>
                </Space>
                <Space>
                    <Button
                        type="primary"
                        onClick={handleNext}
                        disabled={!accepted || isAgeBlocked}
                        icon={<CheckCircleTwoTone twoToneColor="#ffffff" />}
                    >
                        {t("info.actions.completePayment")}
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default MyInfo;
