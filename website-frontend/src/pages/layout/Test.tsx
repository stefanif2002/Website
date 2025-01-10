import React, {useRef, useState} from 'react';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    InfoCircleOutlined,
    HomeOutlined,
    CalendarOutlined,
    WarningOutlined,
    ExceptionOutlined,
    CarOutlined,
    SettingOutlined,
    ToolOutlined,
    TeamOutlined,
    UserOutlined,
    EuroCircleOutlined,
    ExclamationCircleOutlined,
    BookOutlined,
    BellOutlined,
    SmileOutlined,
    BulbOutlined,
    FieldTimeOutlined
} from '@ant-design/icons';
import {
    Button,
    Image,
    Col,
    Layout,
    Menu,
    MenuProps,
    Row,
    FloatButton,
    Space,
    notification,
    Select
} from 'antd';
import styles from "./Dashboard.module.css";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {Footer} from "antd/es/layout/layout";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {faCarBurst, faCarSide, faGasPump, faTableList} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {featureNotImplemented, url, width} from "../resources/service.ts";

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuProps['items'] = [
    getItem('Overview', 'overview', <HomeOutlined />),
    getItem("Today's Bookings", 'today', <FieldTimeOutlined />),
    getItem('Bookings', 'bookings', <BookOutlined />, [
        getItem('Calendar', 'calendar', <CalendarOutlined />),
        getItem('Add Booking', 'add_booking', <i
            className="bi bi-clipboard-plus"/>),
        getItem('Confirm', 'unknown', <ExceptionOutlined />),
        getItem('Unfit', 'unfit', <WarningOutlined />),
    ]),
    getItem('Vehicles', 'cars', <CarOutlined />, [
        getItem('Vehicles', 'car', <CarOutlined />),
        getItem('Service', 'service', <ToolOutlined />),
    ]),
    getItem('Categories', 'cat', <FontAwesomeIcon icon={faTableList}/>, [
        getItem('Categories', 'category', <CarOutlined />),
        getItem('Fuel', 'fuel', <FontAwesomeIcon icon={faGasPump} />),
        getItem('Type', 'type', <FontAwesomeIcon icon={faCarSide}/>),
    ]),
    getItem('Prices', 'price', <EuroCircleOutlined />),
    getItem('Employees', 'employee', <TeamOutlined />),
    getItem("Users", 'user', <UserOutlined />),
    getItem('Emergency', 'emergency', <ExclamationCircleOutlined />, [
        getItem('Accident', 'modal', <FontAwesomeIcon icon={faCarBurst} />),
    ]),
    getItem("System Settings", 'setting', <SettingOutlined />),
    getItem("Info", 'info', <InfoCircleOutlined />),
];

function Test () {
    const [collapsed, setCollapsed] = React.useState(width >= 2.5 );
    const location = useLocation();
    const isOverviewPath = location.pathname === '/dashboard/overview'|| location.pathname === '/dashboard';
    const isTodayPath = location.pathname === '/dashboard/today';
    const isCalendarPath = location.pathname === '/dashboard/calendar';
    const isAddBookingPath = location.pathname === '/dashboard/add_booking';
    const isUnknownPath = location.pathname === '/dashboard/unknown';
    const isUnfitPath = location.pathname === '/dashboard/unfit';
    const isCategoryPath = location.pathname === '/dashboard/category';
    const isFuelPath = location.pathname === '/dashboard/category/fuel';
    const isTypePath = location.pathname === '/dashboard/category/type';
    const isCarPath = location.pathname === '/dashboard/car';
    const isServiceCarPath = location.pathname === '/dashboard/car/service';
    const isPricePath = location.pathname === '/dashboard/price';
    const isEmployeePath = location.pathname === '/dashboard/employee';
    const isUserPath = location.pathname === '/dashboard/user';
    const isAccidentPath = location.pathname === '/dashboard/accident';
    const isSettingsPath = location.pathname === '/dashboard/setting';
    const isInfoPath = location.pathname === '/dashboard/info';
    const contentRef = useRef<HTMLDivElement>(null); // Reference for the Content area
    const companyName = localStorage.getItem('companyName');
    const navigate = useNavigate();
    const [stringImage] = useState<string>("/resources/main.png");
    const [api, contextHolder] = notification.useNotification();


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

    // Redirect to login if companyName is not set
    if (!companyName) {
        return <Navigate to="/" />;
    }

    const handleMenuClick = (key: string) => {
        switch (key) {
            case 'overview':
                navigate('/dashboard/overview');
                break;
            case 'today':
                navigate('/dashboard/today');
                break;
            case 'calendar':
                navigate('/dashboard/calendar');
                break;
            case 'add_booking':
                navigate('/dashboard/add_booking');
                break;
            case 'unknown':
                navigate('/dashboard/unknown');
                break;
            case 'unfit':
                navigate('/dashboard/unfit');
                break;
            case 'category':
                navigate('/dashboard/category');
                break;
            case 'fuel':
                navigate('/dashboard/category/fuel');
                break;
            case 'type':
                navigate('/dashboard/category/type');
                break;
            case 'car':
                navigate('/dashboard/car');
                break;
            case 'service':
                navigate('/dashboard/car/service');
                break;
            case 'price':
                navigate('/dashboard/price');
                break;
            case 'user':
                navigate('/dashboard/user');
                break;
            case 'employee':
                navigate('/dashboard/employee');
                break;
            case 'modal':
                navigate('/dashboard/accident');
                break;
            case 'setting':
                navigate('/dashboard/setting');
                break;
            case 'info':
                navigate('/dashboard/info');
                break;
        }
    };

    const getDefaultSelectedKey = (): string => {
        if (isOverviewPath) return 'overview';
        if (isTodayPath) return 'today';
        if (isCalendarPath) return 'calendar';
        if (isAddBookingPath) return 'add_booking';
        if (isUnknownPath) return 'unknown';
        if (isUnfitPath) return 'unfit';
        if (isCategoryPath) return 'category';
        if (isFuelPath) return 'fuel';
        if (isTypePath) return 'type';
        if (isCarPath) return 'car';
        if (isServiceCarPath) return 'service';
        if (isPricePath) return 'price';
        if (isEmployeePath) return 'employee';
        if (isUserPath) return 'user';
        if (isAccidentPath) return 'modal';
        if (isSettingsPath) return 'setting';
        if (isInfoPath) return 'info';
        return 'overview'; // Fallback to 'overview' if no matches
    };

    const openNotification = () => {
        api.open({
            message: 'Notification Title',
            description:
                'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
    };

    return (
        <Layout style={{ height: '100vh' }} hasSider>
            {contextHolder}
            <Sider trigger={null}
                   collapsible
                   collapsed={collapsed}
                   breakpoint="lg"
                   onBreakpoint={(broken) => {
                       console.log(broken);
                   }}
                   onCollapse={(collapsed, type) => {
                       console.log(collapsed, type);
                   }}
                   style={{
                       background: '#001529',
                       overflowY: 'auto', // Enables independent vertical scrolling
                       left: 0, // Aligns the sider to the left of the screen
                       scrollbarWidth: 'thin',
                       scrollbarGutter: 'stable',
                       minHeight: '100vh'
                   }}
            >
                {collapsed ? null :
                    <div className={styles.logoContainer}>
                        <Image
                            className={styles.logo}
                            style={{margin: '28px'}}
                            src={`${url}${stringImage}`}
                        />
                    </div>
                }

                <Menu
                    mode="inline"
                    defaultSelectedKeys={[getDefaultSelectedKey()]}
                    defaultOpenKeys={collapsed ? [] : ['bookings', 'cars', 'cat', 'employees']}
                    items={items}
                    theme="dark"
                    onClick={(e) => handleMenuClick(e.key as string)}
                />
            </Sider>
            <Layout >
                <Header style={{ padding: 10, background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                        <Col>

                            {width >= 6.4 ? null :
                                <Button
                                    type="text"
                                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                    onClick={() => setCollapsed(!collapsed)}
                                />
                            }
                        </Col>

                        <Col style={{ display: 'flex', alignItems: 'center'}}>
                            <Space>
                                <Select
                                    defaultValue={language}
                                    onChange={handleLanguageChange}
                                    options={typeOptions}
                                    style={{width:'120px'}}
                                />
                                <Profile/>
                            </Space>

                        </Col>
                    </Row>
                </Header>
                <Content
                    ref={contentRef}
                    style={{
                        padding: width < 6.4 ? 25 : 0, // Reduced padding for smaller screens
                        backgroundColor: '#e8eaef',
                        overflowY: 'auto', // Enable vertical scrolling

                    }}
                >

                    <Row>
                        <Col span={24}>
                            {isOverviewPath ? <Overview/> : null}
                            {isTodayPath ? <TodaySBookings/> : null}
                            {isCalendarPath ? <Calendar/> : null}
                            {isAddBookingPath ? <AddBooking/> : null}
                            {isUnknownPath ? <Unknown isItUnknown={true}/> : null}
                            {isUnfitPath ? <Unknown isItUnknown={false}/> : null}
                            {isCategoryPath ? <Categories/> : null}
                            {isFuelPath ? <CategorySide isItType={false}/> : null}
                            {isTypePath ? <CategorySide isItType={true}/> : null}
                            {isCarPath ? <Cars/> : null}
                            {isServiceCarPath ? <Service/> : null}
                            {isPricePath ? <Price/> : null}
                            {isAccidentPath ? <Accident/> : null}
                            {isUserPath ? <User/> : null}
                            {isEmployeePath ? <Employee/> : null}
                            {isSettingsPath ? <SystemSetting/> : null}
                            {isInfoPath ? <InfoPage/> : null}

                        </Col>
                    </Row>

                    <FloatButton.Group
                        trigger="click"
                        type="primary"
                        style={{ insetInlineEnd: 50, insetBlockEnd: 50  }}
                        icon={<BulbOutlined />}
                    >
                        <FloatButton icon={<HomeOutlined />} onClick={() => handleMenuClick("overview")} />

                        <FloatButton icon={<BellOutlined />} onClick={openNotification}/>

                    </FloatButton.Group>

                    <FloatButton.BackTop target={() => contentRef.current!} style={{ insetInlineEnd: 100, insetBlockEnd: 50  }} />

                </Content>
                <Footer style={{ textAlign: 'center' }} >
                    Car Rental CRM ©{new Date().getFullYear()} Created by Stefanos Yfoulis
                </Footer>
            </Layout>

        </Layout>
    );
}

export default Test;