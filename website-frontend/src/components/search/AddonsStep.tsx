import { useEffect, useState } from "react";
import { Button, Card, Col, InputNumber, Row, Space, Typography } from "antd";
import { ADDONS } from "./addonsDef";
import type { FormInstance } from "antd/es/form";
import type { AddonDef } from "./types";

const { Title, Text } = Typography;

type Props = {
    form: FormInstance;
    onNext: () => void;
    currency?: string;
    onTotalsChange?: (total: number) => void; // notify parent on change
};

type QtyMap = Record<string, number>;

export default function AddonsStep({ form, onNext, currency = "EUR", onTotalsChange }: Props) {
    const [qty, setQty] = useState<QtyMap>({});

    // Initialize local qty map and form fields once
    useEffect(() => {
        const init: QtyMap = {};
        for (const a of ADDONS) init[a.value] = 0;
        setQty(init);

        form.setFieldsValue({ checklist: {}, checklistQty: {} });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const computeTotal = () => {
        const cl: Record<string, boolean> = form.getFieldValue(["checklist"]) || {};
        const clq: Record<string, number> = form.getFieldValue(["checklistQty"]) || {};
        const total = ADDONS.reduce((sum, ad) => {
            if (!cl[ad.value]) return sum;
            if (ad.qty) {
                const q = Number(clq[ad.value] || 0);
                return sum + (q > 0 ? ad.price * q : 0);
            }
            return sum + ad.price;
        }, 0);
        onTotalsChange?.(total);
    };

    const toggle = (a: AddonDef) => {
        setQty((prev) => {
            const selected = (prev[a.value] ?? 0) > 0;
            const nextQty = selected ? 0 : (a.qty ? 1 : 1);

            // keep AntD form in sync
            form.setFieldValue(["checklist", a.value], !selected);
            if (a.qty) form.setFieldValue(["checklistQty", a.value], !selected ? 1 : 0);

            const updated = { ...prev, [a.value]: nextQty };
            // notify parent
            Promise.resolve().then(computeTotal);
            return updated;
        });
    };

    const changeQty = (a: AddonDef, newQty: number) => {
        const safe = Math.max(1, Number(newQty) || 1);
        setQty((prev) => ({ ...prev, [a.value]: safe }));
        form.setFieldValue(["checklist", a.value], true);
        form.setFieldValue(["checklistQty", a.value], safe);
        computeTotal();
    };

    return (
        <Card style={{ borderRadius: 12 }} title="Πρόσθετος εξοπλισμός">
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
                {ADDONS.map((a) => {
                    const isSelected = (qty[a.value] ?? 0) > 0;
                    return (
                        <Card key={a.value} style={{ borderRadius: 10, padding: 16 }}>
                            <Row align="middle" gutter={12}>
                                <Col flex="auto">
                                    <Space direction="vertical" size={0}>
                                        <Title level={5} style={{ margin: 0 }}>{a.title}</Title>
                                        {a.description && <Text type="secondary">{a.description}</Text>}
                                    </Space>
                                </Col>

                                <Col>
                                    <Space align="center">
                                        {a.qty && isSelected && (
                                            <InputNumber
                                                min={1}
                                                value={qty[a.value] || 1}
                                                onChange={(v) => changeQty(a, Number(v))}
                                            />
                                        )}

                                        <div style={{ textAlign: "right", minWidth: 110 }}>
                                            <Text type="secondary">Σύνολο:</Text>
                                            <div style={{ fontWeight: 600 }}>
                                                {a.price.toFixed(2)} {currency}
                                            </div>
                                        </div>

                                        <Button type={isSelected ? "default" : "primary"} onClick={() => toggle(a)}>
                                            {isSelected ? "ΑΦΑΙΡΕΣΗ" : "ΕΠΙΛΟΓΗ"}
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    );
                })}
            </Space>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <Button type="primary" onClick={onNext}>ΣΥΝΕΧΕΙΑ</Button>
            </div>
        </Card>
    );
}
