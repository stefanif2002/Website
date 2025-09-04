import React, {useRef} from 'react';
import styles from "./Dashboard.module.css";
import type { MenuProps } from 'antd';
import {Layout, Menu, Image} from 'antd';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MainPage from "../main/MainPage.tsx";
import MyHeader from "./MyHeader.tsx";
import MyFooter from "./MyFooter.tsx";
import {width} from "../../resources/service.ts";
import AddBooking from "../search/AddBooking.tsx"; // <- FIXED PATH
import {useLocation} from "react-router-dom";

const { Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
    overflowY: 'auto',
    height: '100vh',
    position: 'fixed',
    scrollbarWidth: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 2,
};

type MenuItem = Required<MenuProps>['items'][number];
function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, onClick?: () => void): MenuItem {
    return { key, icon, label, onClick } as MenuItem;
}

const items: MenuProps['items'] = [
    getItem('Facebook', 'facebook', <i className="bi bi-facebook" style={{ color: 'grey', fontSize:'18px' }}></i>, () => window.open('https://www.facebook.com/4rent.thessaloniki', '_blank')),
    getItem("Instagram", 'instagram', <i className="bi bi-instagram" style={{ color: 'grey', fontSize:'18px'}}></i>, () => window.open('https://www.instagram.com/4rent.thessaloniki/', '_blank')),
    getItem("Star", 'star', <i className="bi bi-star-fill" style={{ color: 'grey', fontSize:'18px'  }}></i>, () => window.open('https://www.google.gr/search?q=4rent+thessaloniki&ie=utf-8&oe=utf-8&client=firefox-b-ab&gfe_rd=cr&dcr=0&ei=_8nAWcf2A-eAX-KMg5gO#gfe_rd=cr&lrd=0x14a839062199e9af:0x3517eba7fc90a9e1,3,,', '_blank')),
    getItem("Youtube", 'youtube', <i className="bi bi-youtube" style={{ color: 'grey', fontSize:'18px'  }}></i>, () => window.open('https://www.youtube.com/@4rentthessaloniki', '_blank')),
    getItem("Tiktok", 'tiktok', <i className="bi bi-tiktok" style={{ color: 'grey', fontSize:'18px'  }}></i>, () => window.open('https://www.tiktok.com/@4rentthessaloniki', '_blank')),
];

function Dashboard() {
    const contentRef = useRef<HTMLDivElement>(null);
    const { pathname } = useLocation();

    const stripSlash = (p: string) => p.replace(/\/+$/, "");
    const language = (pathname.split("/")[1] || "el");

    // Show main page at "/:lang" or "/" (optional)
    const isMainPagePath = stripSlash(pathname) === `/${language}` || stripSlash(pathname) === "";

    // Legacy search page path
    const isSearchPath = stripSlash(pathname) === `/${language}/search`;

    // NEW: any /book path, with or without language prefix (e.g., "/book/*" or "/el/book/*")
    const isBookPath = /^(\/[a-z]{2})?\/book(\/|$)/i.test(stripSlash(pathname));

    return (
        <Layout style={{ height: '100vh', width: '100vw', backgroundColor: 'white'}} hasSider>
            {width < 4.4 ? (
                <Sider trigger={null} style={siderStyle} collapsed>
                    <div className={styles.logo}>
                        <Image src={`https://4rent-thessaloniki.com/images/Logo_White.png`} style={{ maxWidth: '55px', height: 'auto' }} />
                    </div>
                    <Menu mode="inline" items={items} selectedKeys={[]} style={{backgroundColor: 'transparent'}}/>
                </Sider>
            ) : null}

            <Layout style={{ overflowY: 'auto', overflowX: 'hidden'}}>
                <MyHeader/>
                <Content
                    ref={contentRef}
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        overflow: 'visible',
                        paddingInlineStart: width < 4.4 ? 80 : 0,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minHeight: '608px',
                        }}
                    >
                        {isMainPagePath ? <MainPage/> : null}

                        {(isSearchPath || isBookPath) ? (
                            <div style={{ width: '100%', margin: '0 auto', padding: '0 16px' }}>
                                <AddBooking />
                            </div>
                        ) : null}
                    </div>

                    <MyFooter/>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Dashboard;
