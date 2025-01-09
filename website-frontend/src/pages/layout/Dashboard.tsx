import React, {useState} from 'react';
import styles from "./Dashboard.module.css";
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Layout, Menu, theme, Image, Select, Space, Col, Button, Row} from 'antd';
import {featureNotImplemented, url, width} from "../resources/service.ts";

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    backgroundColor: 'darkcyan', // Set transparent background

};

const items: MenuProps['items'] = [
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    BarChartOutlined,
    CloudOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
}));

function Dashboard () {
    const [stringImage] = useState<string>("/resources/main.png");

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

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
        <>
            <Layout hasSider>
                <Sider style={siderStyle} collapsed={true}>
                    <div >
                        <Image
                            className={styles.logo}
                            style={{margin: '28px'}}
                            src={`${url}${stringImage}`}
                        />
                    </div>
                    <Menu mode="inline" items={items} style={{backgroundColor: 'transparent'}}/>
                </Sider>
                <Layout>
                    <Header style={{ padding: 10, background: '#da2828', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'  }}>
                        <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                            <Col>

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
                    <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
                        <div
                            style={{
                                padding: 24,
                                textAlign: 'center',
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <p>long content</p>
                            {
                                // indicates very long content
                                Array.from({ length: 100 }, (_, index) => (
                                    <React.Fragment key={index}>
                                        {index % 20 === 0 && index ? 'more' : '...'}
                                        <br />
                                    </React.Fragment>
                                ))
                            }
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©{new Date().getFullYear()} Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        </>
    );
}

export default Dashboard;