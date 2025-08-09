import React, { useState, useEffect } from 'react';
import {Image, Card, Space, Row, Col} from 'antd';
import {url, width} from "../../resources/service.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCarSide, faEuroSign, faGasPump, faGears, faUsers} from "@fortawesome/free-solid-svg-icons";


interface CategoryDetailProps {
    av: Availability;
    onSelect: (id: number) => void; // Optional prop
}


interface Category {
    id: number,
    name: string;
    type: string,
    fuel: string,
    numOfSeats: number,
    pricePerDay: number,
    automatic: boolean,
    imageUrl: string,
    color: string
    description: string;
}

interface Availability {
    category: Category;
    totalPrice: number;
    averagePricePerDay: number;
}

const AvailabilityCard: React.FC<CategoryDetailProps> = ({ av, onSelect}) => {
    const [category, setCategory] = useState<Availability| null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [stringImage] = useState<string>("/resources/default.jpg");

    useEffect(() => {
        setCategory(av);
        setLoading(false);

    }, [av]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!category) {
        return <div>Category not found.</div>;
    }

    const handleCardClick = () => {
        onSelect(category.category.id);
    };

    const isMobile = width>=3.38;
    const cardWidth = isMobile ? "100%" : 'auto';
    const imageHeight = isMobile ? 200 : 250;
    const cat = category.category;
    return (
        <div
            onClick={handleCardClick}
            style={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                ...({ ':hover': { transform: 'scale(1.02)' }}) // Optional hover effect
            }}>
            <Card
                title={`Category: ${cat.name}/ Price: ${category.totalPrice}`}
                cover={
                    <Image
                        width={'100%'}
                        style={{ height: imageHeight, objectFit: "cover" }}
                        src={cat.imageUrl ? `${url}${cat.imageUrl}` : `${url}${stringImage}`}
                        //src={`${url}${stringImage}`}
                        preview={false}
                        alt="Category Image"
                    />
                }
                style={{ width: cardWidth, margin: "auto" }}
            >
                {isMobile ?
                    <>
                        <Row  style={{display: 'flex', justifyContent: 'center'}}>
                            <Space size={"middle"}>
                                <Space><FontAwesomeIcon icon={faCarSide}/> Type: {cat.type}</Space>
                                <Space><FontAwesomeIcon icon={faGasPump}/> Fuel: {cat.fuel}</Space>
                            </Space>
                        </Row>
                        <Row style={{display: 'flex', justifyContent: 'center'}}>
                            <Space size={"large"}>
                                <Space><FontAwesomeIcon icon={faGears} /> Transmission: {cat.automatic ? 'Auto' : 'Manual'}</Space>
                                <Space><FontAwesomeIcon icon={faUsers}/> Seats: {cat.numOfSeats}</Space>
                            </Space>
                        </Row>
                        <Row style={{display: 'flex', justifyContent: 'center'}}>
                            <Space size={"large"}>
                                <Space><FontAwesomeIcon icon={faGears} /> Transmission: {cat.automatic ? 'Auto' : 'Manual'}</Space>
                                <Space><FontAwesomeIcon icon={faUsers}/> Seats: {cat.numOfSeats}</Space>
                            </Space>
                        </Row>
                        <Row>
                            <Space><FontAwesomeIcon icon={faEuroSign}/><p>Price Per Day: {category.averagePricePerDay}€</p>  </Space>
                        </Row>
                        <Row style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                            <p>Description: {cat.description}</p>
                        </Row>
                    </> :
                    <>
                        <Row
                            gutter={[16, 16]} // space between items
                            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
                        >
                            <Col>
                                <Space><FontAwesomeIcon icon={faCarSide} /> Type: {cat.type}</Space>
                            </Col>
                            <Col>
                                <Space><FontAwesomeIcon icon={faGasPump} /> Fuel: {cat.fuel}</Space>
                            </Col>
                        </Row>
                        <Row
                            gutter={[16, 16]} // space between items
                            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
                        >
                            <Col>
                                <Space><FontAwesomeIcon icon={faGears} /> Transmission: {cat.automatic ? 'Auto' : 'Manual'}</Space>
                            </Col>
                            <Col>
                                <Space><FontAwesomeIcon icon={faUsers} /> Seats: {cat.numOfSeats}</Space>
                            </Col>
                            <Col>
                                <Space><FontAwesomeIcon icon={faEuroSign} /><p>Price Per Day: {category.averagePricePerDay}€</p></Space>
                            </Col>
                        </Row>


                        <Row style={{display: 'flex', justifyContent: 'space-between'}}>
                            <p>Description: {cat.description}</p>
                        </Row>
                    </>
                }


            </Card>
        </div>
    );
};

export default AvailabilityCard;
