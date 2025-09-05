import { Badge, Card, Divider, Row, Space, Typography } from "antd";

const { Title, Text } = Typography;

type Props = {
    baseTotal?: number;
    addonsTotal: number;
    currency?: string;
    vehicleName?: string;
    vehicleImage?: string;
    pickupLabel?: string;
    dropoffLabel?: string;
    showFreeCancel?: boolean;
};

export default function SummaryCard({
                                        baseTotal,
                                        addonsTotal,
                                        currency,
                                        vehicleName,
                                        vehicleImage,
                                        pickupLabel,
                                        dropoffLabel,
                                        showFreeCancel,
                                    }: Props) {
    const grand = +(baseTotal + addonsTotal).toFixed(2);

    return (
        <Card
            style={{ position: "sticky", top: 16, borderRadius: 12, padding: 16 }}
            title="Περίληψη κόστους"
            extra={<Text type="secondary">Ανοιχτό</Text>}
        >
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
                {pickupLabel && <Text>➜ {pickupLabel}</Text>}
                {dropoffLabel && <Text>➜ {dropoffLabel}</Text>}
            </Space>

            {vehicleImage && (
                <div style={{ background: "#fafafa", borderRadius: 8, padding: 8, margin: "12px 0" }}>
                    <img src={vehicleImage} alt={vehicleName} style={{ width: "100%", objectFit: "contain" }} />
                </div>
            )}

            <Space direction="vertical" style={{ width: "100%" }}>
                <Row justify="space-between">
                    <Text type="secondary">Βασικό σύνολο</Text>
                    <Text>{baseTotal.toFixed(2)} {currency}</Text>
                </Row>
                <Row justify="space-between">
                    <Text type="secondary">Εξοπλισμός</Text>
                    <Text>{addonsTotal.toFixed(2)} {currency}</Text>
                </Row>
                <Divider style={{ margin: "8px 0" }} />
                <Row justify="space-between">
                    <Title level={4} style={{ margin: 0 }}>Σύνολο:</Title>
                    <Title level={4} style={{ margin: 0 }}>{grand.toFixed(2)} {currency}</Title>
                </Row>
            </Space>

            {showFreeCancel && (
                <Badge style={{ marginTop: 8 }} color="green" text="Δωρεάν ακύρωση" />
            )}
        </Card>
    );
}
