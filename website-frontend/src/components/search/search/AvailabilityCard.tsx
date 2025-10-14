import React from "react";
import { Card, Row, Col, Image, Typography, Space, Button, Divider } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGasPump, faGears, faUsers, faEuroSign } from "@fortawesome/free-solid-svg-icons";
import { url, width } from "../../../resources/service.ts";

const { Title, Text } = Typography;

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
interface Props {
    av: Availability;
    onSelect: (id: number) => void;
    /** Optional UI toggles to mimic Carwiz behavior */
    discountPercent?: number;        // e.g. 20 -> shows "-20%" and a crossed original price
    isSoldOut?: boolean;             // greys out card and shows disabled button
}

const AvailabilityCard: React.FC<Props> = ({
                                               av,
                                               onSelect,
                                               isSoldOut = false,
                                           }) => {
    const cat = av.category;

    const daily = av.averagePricePerDay;        // from your API
    const total = av.totalPrice;                // from your API

    // const hasDiscount = !!discountPercent && discountPercent > 0 && discountPercent < 100;

    const imgSrc = cat.imageUrl ? `${url}${cat.imageUrl}` : `${url}/resources/default.jpg`;

    const isWide = width >= 3.2; // your existing width heuristic

    // Long signature -> short code
    const LONG_TO_SHORT: Record<string, string> = {
        "A-G-M-4": "A",
        "A-G-A-4": "AA",
        "B-G-M-4": "B",
        "C-G-M-5": "C",
        "C-D-M-5": "CD",
        "C-G-A-5": "CA",
        "D-G-M-5": "D",
        "D-D-M-5": "DD",
        "D-G-A-5": "DA",
        "E-G-M-5": "E",
        "STW-G-M-5": "EK",
        "STW-G-A-5": "EKA",
        "L-G-M-7": "L",
        "VAN-G-M-7": "L1",
        "VAN-D-M-9": "M",
        "SUV-G-M-5": "S",
        "SUV-G-A-5": "S3",
        "SUV+-G-M-5": "S2",
        "SUV+-L-M-5": "S2+",
        "SUV+-G-A-5": "S3+",
        "LUX-H-A-5": "LUX",
    };

    const shortFromLongName = (longName?: string) =>
        longName ? LONG_TO_SHORT[longName] : undefined;



    return (
        <Card
            hoverable={!isSoldOut}
            style={{
                width: "100%",
                margin: "0 auto",
                opacity: isSoldOut ? 0.35 : 1,
                borderRadius: 12,
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                border: '1px solid rgba(0,0,0,0.25)',
            }}
            bodyStyle={{padding: 16}}
            onClick={() => !isSoldOut && onSelect(cat.id)}
        >
            <div
                style={{
                    background: "#fff",
                    paddingTop: 12,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image
                    src={imgSrc}
                    alt={cat.name}
                    preview={false}
                    style={{width: "100%", maxHeight: isWide ? 220 : 180, objectFit: "contain"}}
                />
            </div>
            {/* Title + subtitle */}
            <div >
                <Title level={4}>
                    {`Category ${shortFromLongName(cat.name) ?? cat.name}`}
                </Title>
            </div>

            <div style={{marginBottom: 8}}>
                <Text strong style={{marginBottom: 4}}>
                    {cat.description ?? "Citroën C3"} ή παρόμοιο
                </Text>
            </div>

            {/* Specs */}
            <Row gutter={[12, 8]} style={{marginBottom: 12, justifyContent: 'center'}}>

                <Col>
                    <Space>
                        <FontAwesomeIcon icon={faGasPump}/>
                        <Text>{cat.fuel}</Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        <FontAwesomeIcon icon={faGears}/>
                        <Text>{cat.automatic ? "Auto" : "Manual"}</Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        <FontAwesomeIcon icon={faUsers}/>
                        <Text>{cat.numOfSeats}</Text>
                    </Space>
                </Col>
            </Row>

            {/* Price blocks */}
            <Row gutter={16} style={{marginBottom: 12}}>
                <Col xs={12}>
                    <Text type="secondary" style={{display: "block"}}>
                        Ανά ημέρα:
                    </Text>
                    <Title level={4} style={{margin: 0}}>
                        {daily.toFixed(2)} <FontAwesomeIcon icon={faEuroSign} style={{fontSize: 14}}/>{" "}
                        <Text type="secondary" style={{fontSize: 12}}>EUR</Text>
                    </Title>
                </Col>
                <Col xs={12}>
                    <Text type="secondary" style={{display: "block"}}>
                        Σύνολο:
                    </Text>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Title level={3} style={{margin: 0}}>
                            {total.toFixed(2)} <Text style={{fontSize: 12}}>EUR</Text>
                        </Title>
                    </div>
                </Col>
            </Row>

            <Divider style={{margin: "8px 0 12px"}}/>

            <div style={{justifyContent: 'center'}}>
                <Button
                    block
                    disabled={isSoldOut}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(cat.id);
                    }}
                    size="large"
                    style={{
                        width: '50%',
                        borderRadius: 999,
                        background: "linear-gradient(180deg, #028523 0%, #028523 100%)",
                        border: 0,
                        fontWeight: 600,
                        lineHeight: 1,
                        color: 'white'
                    }}
                >
                    Κράτηση Τώρα
                </Button>
            </div>

            {/* CTAs */}
            {/*<Row gutter={12}>*/}

            {/*    <Col xs={24} sm={12}>*/}
            {/*        <Button*/}
            {/*            block*/}
            {/*            disabled={isSoldOut}*/}
            {/*            onClick={(e) => {*/}
            {/*                e.stopPropagation();*/}
            {/*                onSelect(cat.id);*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            Pay only advance 49.00 EUR*/}
            {/*        </Button>*/}
            {/*    </Col>*/}
            {/*    <Col xs={24} sm={12}>*/}
            {/*        <Button*/}
            {/*            type="primary"*/}
            {/*            block*/}
            {/*            disabled={isSoldOut}*/}
            {/*            onClick={(e) => {*/}
            {/*                e.stopPropagation();*/}
            {/*                onSelect(cat.id);*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            Pay Now*/}
            {/*        </Button>*/}
            {/*    </Col>*/}
            {/*</Row>*/}

            {/* Sold out overlay button (optional look-alike) */}
            {isSoldOut && (
                <div style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Button disabled size="large" style={{opacity: 1}}>
                        ΕΞΑΝΤΛΗΜΕΝΟ
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default AvailabilityCard;
