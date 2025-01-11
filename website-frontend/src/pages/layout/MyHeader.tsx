import {Col, Dropdown, Layout, Menu, MenuProps, Row, Select, Space} from "antd";
import React, {useState} from "react";
import {featureNotImplemented} from "../resources/service.ts";
import {DownOutlined, SmileOutlined} from "@ant-design/icons";
import { mainMenuItems } from "./menuData.tsx"; // <-- import the big array from above

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


    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item (disabled)
                </a>
            ),
            icon: <SmileOutlined />,
            disabled: true,
        },
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    3rd menu item (disabled)
                </a>
            ),
            disabled: true,
        },
        {
            key: '4',
            danger: true,
            label: 'a danger item',
        },
    ];

    return (
        <Header style={{ padding: 10, background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', marginInlineStart: 80  }}>
            <Row justify="space-between" align="middle" style={{ width: '100%', marginInlineEnd: 17 }}>
                <Col>

                </Col>
                <Col >
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