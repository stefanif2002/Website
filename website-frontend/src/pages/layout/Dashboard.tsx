import React, {useRef, useState} from 'react';
import styles from "./Dashboard.module.css";
import type { MenuProps } from 'antd';
import {Layout, Menu, theme, Image} from 'antd';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MainPage from "../main/MainPage.tsx";
import MyHeader from "./MyHeader.tsx";
import MyFooter from "./MyFooter.tsx";
import {width} from "../resources/service.ts";


const {  Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
    overflowY: 'auto',
    height: '100vh',
    position: 'fixed',
    scrollbarWidth: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black with 60% transparency
    zIndex: 2,
};

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    onClick?: () => void, // Add an optional onClick handler
): MenuItem {
    return {
        key,
        icon,
        label,
        onClick, // Include the onClick property
    } as MenuItem;
}

const items: MenuProps['items'] = [
    getItem('Facebook', 'facebook', <i className="bi bi-facebook" style={{ color: 'grey', fontSize:'18px' }}></i>, () => window.open('https://www.facebook.com/4rent.thessaloniki', '_blank')),
    getItem("Instagram", 'instagram', <i className="bi bi-instagram" style={{ color: 'grey', fontSize:'18px'}}></i>, () => window.open('https://www.instagram.com/4rent.thessaloniki/', '_blank')),
    getItem("Star", 'star', <i className="bi bi-star-fill" style={{ color: 'grey', fontSize:'18px'  }}></i>, () => window.open('https://www.google.gr/search?q=4rent+thessaloniki&ie=utf-8&oe=utf-8&client=firefox-b-ab&gfe_rd=cr&dcr=0&ei=_8nAWcf2A-eAX-KMg5gO#gfe_rd=cr&lrd=0x14a839062199e9af:0x3517eba7fc90a9e1,3,,', '_blank')),
    getItem("Youtube", 'youtube', <i className="bi bi-youtube" style={{ color: 'grey', fontSize:'18px'  }}></i>, () => window.open('https://www.youtube.com/@4rentthessaloniki', '_blank')),
    getItem("Tiktok", 'tiktok', <i className="bi bi-tiktok" style={{ color: 'grey', fontSize:'18px'  }}></i>, () => window.open('https://www.tiktok.com/@4rentthessaloniki', '_blank')),
];

function Dashboard() {
    const [stringImage] = useState<string>("/resources/main.png");
    const contentRef = useRef<HTMLDivElement>(null); // Reference for the Content area


    const {
        token: { borderRadiusLG },
    } = theme.useToken();


    return (
            <Layout style={{ height: '100vh', width: '100vw', backgroundColor: 'white'}} hasSider>
                {width<3.2 ?
                <Sider trigger={null} style={siderStyle} collapsed={true}>
                    <div className={styles.logo}>
                        <Image

                            src={`https://4rent-thessaloniki.com/images/Logo_White.png`}
                            style={{ maxWidth: '55px', height: 'auto' }} // Ensures responsiveness

                        />
                    </div>
                    <Menu mode="inline" items={items} selectedKeys={[]} style={{backgroundColor: 'transparent'}}/>
                </Sider>
                    : null }
                <Layout style={{ overflowY: 'auto', overflowX: 'hidden'}}>
                    <MyHeader/>
                    <Content
                        ref={contentRef}
                        style={{
                            position: 'relative', // Make the content container a relative parent
                            zIndex: 1, // Ensure the text stays on top
                            height: '100%',
                            display: 'flex', // Flexbox for centering
                            flexGrow: 1,
                            justifyContent: 'center', // Center horizontally
                            backgroundColor: 'white',
                            overflow: 'auto'
                        }}
                    >
                        {/* Background image div */}


                        {/* Centered Content */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column', // Stack elements vertically
                                alignItems: 'center', // Center horizontally
                                borderRadius: borderRadiusLG,
                                marginInlineStart: width<3.2 ? 80 : 0
                            }}
                        >
                            <MainPage/>

                            <MyFooter/>
                        </div>


                    </Content>


                </Layout>
            </Layout>
    )
        ;
}

export default Dashboard;