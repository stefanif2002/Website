import React, { useRef } from "react";
import styles from "./Dashboard.module.css";
import type { MenuProps } from "antd";
import { Layout, Menu, Image } from "antd";
import "bootstrap-icons/font/bootstrap-icons.css";
import MainPage from "../main/MainPage.tsx";
import MyHeader from "./MyHeader.tsx";
import MyFooter from "./MyFooter.tsx";
import { width } from "../../resources/service.ts";
import AddBooking from "../search/AddBooking.tsx";
import { useLocation } from "react-router-dom";
import FleetCategoriesPage from "../FleetCategoriesPage.tsx";
import FleetCategoryView from "../FleetCategoryView.tsx";

const { Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
    overflowY: "auto",
    height: "100vh",
    position: "fixed",
    scrollbarWidth: "none",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 2,
};

type MenuItem = Required<MenuProps>["items"][number];
function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    onClick?: () => void
): MenuItem {
    return { key, icon, label, onClick } as MenuItem;
}

const items: MenuProps["items"] = [
    getItem(
        "Facebook",
        "facebook",
        <i className="bi bi-facebook" style={{ color: "grey", fontSize: "18px" }} />,
        () => window.open("https://www.facebook.com/4rent.thessaloniki", "_blank")
    ),
    getItem(
        "Instagram",
        "instagram",
        <i className="bi bi-instagram" style={{ color: "grey", fontSize: "18px" }} />,
        () => window.open("https://www.instagram.com/4rent.thessaloniki/", "_blank")
    ),
    getItem(
        "Star",
        "star",
        <i className="bi bi-star-fill" style={{ color: "grey", fontSize: "18px" }} />,
        () =>
            window.open(
                "https://www.google.gr/search?q=4rent+thessaloniki&ie=utf-8&oe=utf-8&client=firefox-b-ab&gfe_rd=cr&dcr=0&ei=_8nAWcf2A-eAX-KMg5gO#gfe_rd=cr&lrd=0x14a839062199e9af:0x3517eba7fc90a9e1,3,,",
                "_blank"
            )
    ),
    getItem(
        "Youtube",
        "youtube",
        <i className="bi bi-youtube" style={{ color: "grey", fontSize: "18px" }} />,
        () => window.open("https://www.youtube.com/@4rentthessaloniki", "_blank")
    ),
    getItem(
        "Tiktok",
        "tiktok",
        <i className="bi bi-tiktok" style={{ color: "grey", fontSize: "18px" }} />,
        () => window.open("https://www.tiktok.com/@4rentthessaloniki", "_blank")
    ),
];

function Dashboard() {
    const contentRef = useRef<HTMLDivElement>(null);
    const { pathname } = useLocation();

    const strip = (p: string) => p.replace(/\/+$/, "");
    const parts = strip(pathname).split("/").filter(Boolean); // e.g. ["el","stolos","..."] or ["book", ...]

    // language handling
    const langRE = /^[a-z]{2}$/i;
    const hasLang = parts.length > 0 && langRE.test(parts[0]);
    const langPrefix = hasLang ? `/${parts[0]}` : "/el"; // default to el
    const bodyParts = hasLang ? parts.slice(1) : parts;

    // main/search
    const isMainPagePath =
        strip(pathname) === `${langPrefix}` || strip(pathname) === "";
    const isSearchPath = strip(pathname) === `${langPrefix}/search`;

    // book
    const isBookPath = /^(\/[a-z]{2})?\/book(\/|$)/i.test(strip(pathname));

    // fleet routing
    const stolosIdx = bodyParts.findIndex((p) => p === "stolos");
    const fleetSlug = stolosIdx >= 0 ? bodyParts[stolosIdx + 1] : undefined;

    const FLEET_INDEX_SLUG = "diathesimes-katigories-o-stolos-mas";
    const isFleetIndex =
        stolosIdx >= 0 && (fleetSlug === FLEET_INDEX_SLUG || fleetSlug === undefined);

    const SUPPORTED_FLEET_SLUGS = new Set([
        "mikri-katigoria-enoikiaseis-autokiniton-thessaloniki",
        "mesaia-katigoria-enoikiaseis-autokiniton-thessaloniki",
        "megali-katigoria-enoikiaseis-autokiniton-thessaloniki",
        "oikogeniaki-katigoria-enoikiaseis-autokiniton-thessaloniki",
        "anoteri-katigoria-enoikiaseis-autokiniton-thessaloniki",
        "karaban-katigoria-enoikiaseis-autokiniton-thessaloniki",
        "suv-jeep-enoikiaseis-autokiniton-thessaloniki",
        "minivan-7theseis-enoikiaseis-autokiniton-thessaloniki",
        "minivan-9theseis-enoikiaseis-autokiniton-thessaloniki",
        "automato-autokinito-enoikiaseis-thessaloniki",
        "petrelaio-autokinito-enoikiaseis-thessaloniki",
        "enoikiasi-politeleias-autokinito-thessaloniki",
    ]);

    const isFleetCategoryPage =
        stolosIdx >= 0 && !!fleetSlug && SUPPORTED_FLEET_SLUGS.has(fleetSlug);

    const renderFleetCategory = () => {
        if (!fleetSlug) return null;


        // Fallback: use the categories page but PASS THE SLUG
        return <FleetCategoryView slug={fleetSlug} />;
    };

    return (
        <Layout style={{ height: "100vh", width: "100vw", backgroundColor: "white" }} hasSider>
            {width < 4.4 ? (
                <Sider trigger={null} style={siderStyle} collapsed>
                    <div className={styles.logo}>
                        <Image
                            src={`https://4rent-thessaloniki.com/images/Logo_White.png`}
                            style={{ maxWidth: "55px", height: "auto" }}
                        />
                    </div>
                    <Menu mode="inline" items={items} selectedKeys={[]} style={{ backgroundColor: "transparent" }} />
                </Sider>
            ) : null}

            <Layout style={{ overflowY: "auto", overflowX: "hidden" }}>
                <MyHeader />
                <Content
                    ref={contentRef}
                    style={{
                        position: "relative",
                        zIndex: 1,
                        overflow: "visible",
                        paddingInlineStart: width < 4.4 ? 80 : 0,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            minHeight: "608px",
                        }}
                    >
                        {isMainPagePath ? <MainPage /> : null}

                        {(isSearchPath || isBookPath) ? (
                            <div style={{ width: "100%", margin: "0 auto", padding: "0 16px" }}>
                                <AddBooking />
                            </div>
                        ) : null}

                        {isFleetIndex && (
                            <div style={{ width: "100%", margin: "0 auto", padding: "0 16px" }}>
                                {/* PASS slug for the index too */}
                                <FleetCategoriesPage />
                            </div>
                        )}

                        {isFleetCategoryPage && !isFleetIndex && (
                            <div style={{ width: "100%", margin: "0 auto", padding: "0 16px" }}>
                                {renderFleetCategory()}
                            </div>
                        )}
                    </div>

                    <MyFooter />
                </Content>
            </Layout>
        </Layout>
    );
}

export default Dashboard;
