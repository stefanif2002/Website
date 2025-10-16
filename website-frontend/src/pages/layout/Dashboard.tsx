import React, { useEffect, useRef } from 'react';
import styles from './Dashboard.module.css';
import type { MenuProps } from 'antd';
import { Layout, Menu, Image } from 'antd';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MainPage from '../main/MainPage';
import MyHeader from './MyHeader';
import MyFooter from './MyFooter';
import { width } from '../../resources/service';
import AddBooking from '../search/AddBooking';
import { useLocation } from 'react-router-dom';
import FleetCategoriesPage from '../FleetCategoriesPage';
import FleetCategoryView from '../FleetCategoryView';
import { Trans, useTranslation } from 'react-i18next';
import Offer2026Page from "../extra/Offer2026Page.tsx";
import ReviewsPage from "../extra/ReviewsPage.tsx";
import FourRentVsCompetitorPage from "../extra/FourRentVsCompetitorPage.tsx";
import PremiumServicePage from "../extra/PremiumServicePage.tsx";
import CheapRentalsPage from "../extra/CheapRentalsPage.tsx";
import MixedInsuranceNoDepositPage from "../extra/MixedInsuranceNoDepositPage.tsx";
import FaqThessalonikiPage from "../extra/FaqThessalonikiPage.tsx";

const { Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
    overflowY: 'auto',
    height: '100vh',
    position: 'fixed',
    scrollbarWidth: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 2,
};

const SUPPORTED = new Set(['en', 'el-GR']);

function strip(p: string) {
    return p.replace(/\/+$/, '');
}

export default function Dashboard() {
    const contentRef = useRef<HTMLDivElement>(null);
    const { pathname } = useLocation();
    const { t, i18n } = useTranslation();

    // ---- language from URL (once) ----
    useEffect(() => {
        const parts = strip(pathname).split('/').filter(Boolean);
        const maybeLng = parts[0];
        if (maybeLng && SUPPORTED.has(maybeLng)) {
            if (i18n.resolvedLanguage !== maybeLng) {
                i18n.changeLanguage(maybeLng);
            }
        }
    }, [pathname, i18n]);

    const parts = strip(pathname).split('/').filter(Boolean);
    const hasLang = parts[0] && SUPPORTED.has(parts[0]);
    const langPrefix = hasLang ? `/${parts[0]}` : '';
    const bodyParts = hasLang ? parts.slice(1) : parts;

    // utility: normalize and detect path segment
    function isPath(pathname: string, langPrefix: string, slug: string | RegExp): boolean {
        const clean = strip(pathname);
        if (slug instanceof RegExp) return slug.test(clean);
        return clean === `${langPrefix}/${slug}` || clean === `/el-GR/${slug}` || clean === `/en/${slug}`;
    }

    const isMainPagePath = strip(pathname) === `${langPrefix}` || strip(pathname) === "";
    const isSearchPath = isPath(pathname, langPrefix, "search");
    const isBookPath = isPath(pathname, langPrefix, /^\/?(book)(\/|$)/i);
    const isOfferPage = isPath(pathname, langPrefix, "prosfora-enoikiasi-autokinitou-thessaloniki");
    const isReviewPage = isPath(pathname, langPrefix, "enoikiasi-autokinitou-thessaloniki-kritikes");
    const isFourRentVsCompetitorPage = isPath(pathname, langPrefix, "enoikiaseis-autokiniton-thessaloniki/4rent-vs-antagonistis");
    const isPremiumPage = isPath(pathname, langPrefix, "enoikiaseis-autokiniton-thessaloniki/ypiresia-premium");
    const isCheapCarsPage = isPath(pathname, langPrefix, "enoikiaseis-autokiniton-thessaloniki/fthina-enoikiazomena-aftokinita-thessaloniki");
    const isFullInsurancePage = isPath(pathname, langPrefix, "enoikiaseis-autokiniton-thessaloniki/mikti-asfaleia-xoris-eggyisis");
    const isCommonQuestionsPage = isPath(pathname, langPrefix, "enoikiaseis-autokiniton-thessaloniki/syxnes-erotiseis");



    const stolosIdx = bodyParts.findIndex((p) => p === 'stolos');
    const fleetSlug = stolosIdx >= 0 ? bodyParts[stolosIdx + 1] : undefined;

    const FLEET_INDEX_SLUG = 'diathesimes-katigories-o-stolos-mas';
    const isFleetIndex = stolosIdx >= 0 && (fleetSlug === FLEET_INDEX_SLUG || fleetSlug === undefined);

    const SUPPORTED_FLEET_SLUGS = new Set([
        'mikri-katigoria-enoikiaseis-autokiniton-thessaloniki',
        'mesaia-katigoria-enoikiaseis-autokiniton-thessaloniki',
        'megali-katigoria-enoikiaseis-autokiniton-thessaloniki',
        'oikogeniaki-katigoria-enoikiaseis-autokiniton-thessaloniki',
        'anoteri-katigoria-enoikiaseis-autokiniton-thessaloniki',
        'karaban-katigoria-enoikiaseis-autokiniton-thessaloniki',
        'suv-jeep-enoikiaseis-autokiniton-thessaloniki',
        'minivan-7theseis-enoikiaseis-autokiniton-thessaloniki',
        'minivan-9theseis-enoikiaseis-autokiniton-thessaloniki',
        'automato-autokinito-enoikiaseis-thessaloniki',
        'petrelaio-autokinito-enoikiaseis-thessaloniki',
        'enoikiasi-politeleias-autokinito-thessaloniki',
    ]);

    const isFleetCategoryPage = stolosIdx >= 0 && !!fleetSlug && SUPPORTED_FLEET_SLUGS.has(fleetSlug);

    const renderFleetCategory = () => {
        if (!fleetSlug) return null;
        return <FleetCategoryView slug={fleetSlug} />;
    };

    return (
        <Layout style={{ height: '100vh', width: '100vw', backgroundColor: 'white' }} hasSider>
            {width < 4.4 ? (
                <Sider trigger={null} style={siderStyle} collapsed>
                    <div className={styles.logo}>
                        <Image src="https://4rent-thessaloniki.com/images/Logo_White.png" style={{ maxWidth: 55, height: 'auto' }} />
                    </div>
                    <Menu mode="inline" selectedKeys={[]} style={{ backgroundColor: 'transparent' }}
                          items={[
                              { key: 'facebook', label: 'Facebook', icon: <i className="bi bi-facebook" style={{ color: 'grey', fontSize: 18 }} />, onClick: () => window.open('https://www.facebook.com/4rent.thessaloniki', '_blank') },
                              { key: 'instagram', label: 'Instagram', icon: <i className="bi bi-instagram" style={{ color: 'grey', fontSize: 18 }} />, onClick: () => window.open('https://www.instagram.com/4rent.thessaloniki/', '_blank') },
                              { key: 'star', label: t('menu.review', 'Review us'), icon: <i className="bi bi-star-fill" style={{ color: 'grey', fontSize: 18 }} />, onClick: () => window.open('https://www.google.gr/search?q=4rent+thessaloniki#lrd=0x14a839062199e9af:0x3517eba7fc90a9e1,3', '_blank') },
                              { key: 'youtube', label: 'YouTube', icon: <i className="bi bi-youtube" style={{ color: 'grey', fontSize: 18 }} />, onClick: () => window.open('https://www.youtube.com/@4rentthessaloniki', '_blank') },
                              { key: 'tiktok', label: 'TikTok', icon: <i className="bi bi-tiktok" style={{ color: 'grey', fontSize: 18 }} />, onClick: () => window.open('https://www.tiktok.com/@4rentthessaloniki', '_blank') },
                          ]}
                    />
                </Sider>
            ) : null}

            <Layout style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                <MyHeader />
                <Content
                    ref={contentRef}
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        overflow: 'visible',
                        paddingInlineStart: width < 4.4 ? 80 : 0,
                        paddingTop: 26,              // ⬅️ add this line
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 608 }}>
                        {/*<p>*/}
                        {/*    <Trans i18nKey="editCode">*/}
                        {/*        Edit <code>src/App.tsx</code> and save to test HMR*/}
                        {/*    </Trans>*/}
                        {/*</p>*/}
                        {/*<p>{t('clickLogos', 'Click on the logos!')}</p>*/}

                        {isMainPagePath ? <MainPage /> : null}

                        {(isSearchPath || isBookPath) && (
                            <div style={{ width: '100%', margin: '0 auto', padding: '0 16px' }}>
                                <AddBooking />
                            </div>
                        )}

                        {isFleetIndex && (
                            <div style={{ width: '100%', margin: '0 auto', padding: '0 16px' }}>
                                <FleetCategoriesPage />
                            </div>
                        )}

                        {isFleetCategoryPage && !isFleetIndex && (
                            <div style={{ width: '100%', margin: '0 auto', padding: '0 16px' }}>
                                {renderFleetCategory()}
                            </div>
                        )}

                        {isOfferPage && (
                            <div style={{ width: '100%', margin: '0 auto', padding: '0 16px' }}>
                                <Offer2026Page />
                            </div>
                        )}

                        {isReviewPage && (
                            <div style={{ width: '100%', margin: '0 auto', padding: '0 16px' }}>
                                <ReviewsPage />
                            </div>
                        )}

                        {isFourRentVsCompetitorPage && (
                            <div style={{ width: '100%', margin: '0 auto', padding: '0 16px' }}>
                                <FourRentVsCompetitorPage />
                            </div>
                        )}

                        {isPremiumPage && (
                            <div style={{ width: '100%', margin: '0 auto', padding: '0 16px' }}>
                                <PremiumServicePage />
                            </div>
                        )}

                        {isCheapCarsPage && (
                            <div style={{ width: '100%', margin: '0 auto', padding: '0 16px' }}>
                                <CheapRentalsPage />
                            </div>
                        )}

                        {isFullInsurancePage && (
                            <div style={{ width: '100%', margin: '0 auto', padding: '0 16px' }}>
                                <MixedInsuranceNoDepositPage />
                            </div>
                        )}

                        {isCommonQuestionsPage && (
                            <div style={{ width: '100%', margin: '0 auto', padding: '0 16px' }}>
                                <FaqThessalonikiPage />
                            </div>
                        )}

                    </div>

                    <MyFooter />
                </Content>
            </Layout>
        </Layout>
    );
}
