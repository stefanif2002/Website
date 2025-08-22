import {Col, Image, Layout, Menu, MenuProps, Row, Select, Space} from "antd";
import React, {useState} from "react";
import {featureNotImplemented, width} from "../../resources/service.ts";
import { mainMenuItems } from "./menuData.tsx";
import styles from "./Dashboard.module.css"; // <-- import the big array from above

const menuItems: MenuProps['items'] = mainMenuItems;

const { Header} = Layout;


function MyHeader () {
    const typeOptions = [
        {
            label: (
                <Space >
                    <img
                        src="https://flagcdn.com/w40/gb.png"
                        alt="English"
                        style={{ width: 20, height: 15, marginTop:'8px' }}
                    />
                    English
                </Space>
            ),
            value: 'en',
        },
        {
            label: (
                <Space>
                    <img
                        src="https://flagcdn.com/w40/gr.png"
                        alt="Ελληνικά"
                        style={{ width: 20, height: 15, marginTop:'8px' }}

                    />
                    Ελληνικά
                </Space>
            ),
            value: 'el',
        },
        // Add more languages here as needed
    ];

    const [language, setLanguage] = useState<string>('en'); // Default language

    // Handle language change
    const handleLanguageChange = (value: string) => {
        if (value === "el")
            featureNotImplemented()
        else {
            setLanguage(value);
        }

        // You can implement the language switching logic here (e.g., update translations)
    };

    return (
        <Header style={{ padding: 10, background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Row justify="space-between" align="middle" style={{ width: '100%', marginInlineEnd: 17 }}>
                <Col/>
                {width<4.4 ? width<4 ? <Col/> : <Col/> : <Col xs={3} >
                    <div className={styles.logo}>
                        <Image

                            src={`https://4rent-thessaloniki.com/images/Logo_White.png`}
                            style={{maxWidth: '55px', height: 'auto'}} // Ensures responsiveness

                        />
                    </div>
                </Col> }

                <Col span={12}>
                    <Menu
                        mode="horizontal"
                        items={menuItems}
                        selectable={false}
                        // optional: subMenuCloseDelay, subMenuOpenDelay, etc.
                    />
                </Col>

                <Col style={{ display: 'flex', alignItems: 'center'}}>
                    <Space>
                        <Select
                            defaultValue={language}
                            onChange={handleLanguageChange}
                            options={typeOptions}
                            style={{width:'120px'}}
                        />

                    </Space>

                </Col>
            </Row>
        </Header>
    );
}

export default MyHeader;