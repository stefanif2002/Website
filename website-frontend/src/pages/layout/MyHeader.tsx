import React, { useMemo } from "react";
import { Col, Image, Layout, Menu, MenuProps, Row, Select, Space } from "antd";
import styles from "./Dashboard.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { mainMenuItems, type NavItem } from "./menuData";
import {width} from "../../resources/service.ts";

const { Header } = Layout;

const SUPPORTED = ["en", "el-GR"] as const;
type SupportedLng = typeof SUPPORTED[number];

const LANG_PREFIX_RE = /^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/i;

function isExternal(href: string) {
    return /^(https?:)?\/\//i.test(href) || /^mailto:/i.test(href) || /^tel:/i.test(href);
}

function rePrefix(path: string, lang: SupportedLng) {
    if (!path) return `/${lang}/`;
    if (isExternal(path)) return path;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const stripped = normalized.replace(LANG_PREFIX_RE, ""); // remove any existing /{lang}
    return `/${lang}${stripped || "/"}`;
}

function replaceLangInPath(pathname: string, newLng: SupportedLng) {
    const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    const isLang = parts[0] && SUPPORTED.includes(parts[0] as SupportedLng);
    const next = isLang ? [newLng, ...parts.slice(1)] : [newLng, ...parts];
    return "/" + next.join("/");
}

/** Map our simple NavItem[] to AntD Menu items */
function mapNavToMenu(
    items: NavItem[] | undefined,
    navigate: ReturnType<typeof useNavigate>,
    currentLng: SupportedLng
): MenuProps["items"] {
    return items?.map((it) => {
        if (!it) return it as any;
        const out: any = {
            key: it.key,
            label: it.label,
        };
        if (it.children) {
            out.children = mapNavToMenu(it.children, navigate, currentLng);
        }
        if (it.href) {
            out.onClick = () => navigate(rePrefix(it.href!, currentLng));
        }
        return out;
    });
}

export default function MyHeader() {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const resolved = (i18n.resolvedLanguage || i18n.language) as SupportedLng | string;
    const currentLng: SupportedLng = SUPPORTED.includes(resolved as SupportedLng) ? (resolved as SupportedLng) : "en";

    const options = [
        {
            label: (
                <Space>
                    <img src="https://flagcdn.com/w40/gb.png" alt="English" style={{ width: 20, height: 15, marginTop: 8 }} />
                    English
                </Space>
            ),
            value: "en",
        },
        {
            label: (
                <Space>
                    <img src="https://flagcdn.com/w40/gr.png" alt="Ελληνικά" style={{ width: 20, height: 15, marginTop: 8 }} />
                    Ελληνικά
                </Space>
            ),
            value: "el-GR",
        },
    ];

    const langMenuItems: MenuProps["items"] = useMemo(
        () => mapNavToMenu(mainMenuItems, navigate, currentLng),
        [navigate, currentLng]
    );

    const onChange = async (lng: SupportedLng) => {
        await i18n.changeLanguage(lng);
        const nextPath = replaceLangInPath(pathname, lng);
        navigate(nextPath, { replace: true });
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
                    <Menu mode="horizontal" items={langMenuItems} selectable={false} />
                </Col>

                <Col style={{ display: 'flex', alignItems: 'center'}}>
                    <Space>
                        <Select value={currentLng} onChange={onChange} options={options} style={{ width: 140 }} />
                    </Space>

                </Col>
            </Row>
        </Header>
    );
}
