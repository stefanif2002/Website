import { Button, Carousel, Col, Image, Row, Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { width } from "../../resources/service";
import { useLangRouter } from "../../resources/useLangRouter";
import { Trans, useTranslation } from "react-i18next";
import React from "react";

function MainPage() {
    const { t, i18n } = useTranslation("main");
    const { go } = useLangRouter();

    const contentStyle: React.CSSProperties = {
        height: "160px",
        color: "#fff",
        lineHeight: "160px",
        textAlign: "center",
        background: "#364d79",
    };

    // Link helpers from i18n so routing stays language-aware
    const linkFleet = t("links.fleet");
    const linkInsurance = t("links.insurance");
    const linkPremium = t("links.premium");
    const linkReviews = t("links.reviews");
    const linkFleetHere = t("links.fleetHere");

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `
            linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 70%),
            url(https://4rent-thessaloniki.com/images/background.jpg)
          `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: 0.6,
                    zIndex: -1,
                }}
            />

            {/* Title with <br/> preserved from i18n */}
            <h1
                style={{
                    color: "#ce0505",
                    fontSize: `${width < 3.2 ? 5 : 2}rem`,
                    textAlign: "center",
                    opacity: 0.7,
                    marginBottom: "0.5rem",
                }}
            >
                <Trans
                    i18nKey="hero.title"
                    ns="main"
                    components={{ br: <br /> }}
                />
            </h1>

            <h2
                style={{
                    color: "#ce0505",
                    textAlign: "center",
                    opacity: 0.7,
                    fontWeight: "normal",
                    maxWidth: "80%"
                }}
            >
                {t("hero.subtitle")}
            </h2>

            <Button
                style={{
                    backgroundColor: "#ce0505",
                    color: "#fff",
                    padding: "10px 20px",
                    fontSize: "1.2rem",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "80px"
                }}
                onClick={() => go("/search")}
            >
                {t("hero.bookNow")}
            </Button>

            <div style={{ width: "60%", textAlign: "start", lineHeight: "1.6", marginTop: "60px", fontSize: "1rem" }}>
                <h2 style={{ fontSize: "2rem" }}>{t("section.airportTitle")}</h2>

                <p>
                    <Trans i18nKey="p.welcome" ns="main" components={{ b: <b /> }} />
                </p>

                <p>
                    <Trans
                        i18nKey="p.intro"
                        ns="main"
                        components={{
                            b: <b />,
                            linkFleet: <a style={{ color: "#ce0505", fontWeight: "bold" }} href={linkFleet} />
                        }}
                    />
                </p>

                <p>
                    <Trans
                        i18nKey="p.airportHotel"
                        ns="main"
                        components={{ b: <b /> }}
                    />
                </p>

                <p>
                    <Trans
                        i18nKey="p.insurance"
                        ns="main"
                        components={{
                            b: <b />,
                            linkInsurance: <a style={{ color: "#ce0505", fontWeight: "bold" }} href={linkInsurance} />
                        }}
                    />
                </p>

                <p>
                    <Trans i18nKey="p.deposit" ns="main" components={{ b: <b /> }} />
                </p>

                <p>
                    <Trans
                        i18nKey="p.premium"
                        ns="main"
                        components={{
                            b: <b />,
                            linkPremium: <a style={{ color: "#ce0505", fontWeight: "bold" }} href={linkPremium} />
                        }}
                    />
                </p>

                <p>
                    <Trans
                        i18nKey="p.reviews"
                        ns="main"
                        components={{
                            linkReviews: <a style={{ color: "#ce0505", fontWeight: "bold" }} href={linkReviews} />
                        }}
                    />
                </p>

                <h2 style={{ fontSize: "2rem", color: "#ce0505", textAlign: "center" }}>
                    {t("smart.title")}
                </h2>
                <br />

                <h4>{t("fleet.heading")}</h4>
                <p>{t("fleet.desc")}</p>
                <p>
                    <Trans
                        i18nKey="fleet.seeAll"
                        ns="main"
                        components={{
                            linkHere: <a style={{ color: "#ce0505", fontWeight: "bold" }} href={linkFleetHere} />
                        }}
                    />
                </p>
            </div>

            <div style={{ width: "80%", maxWidth: "500px", marginTop: "30px" }}>
                <Carousel autoplay speed={1000} style={{ height: "300px" }}>
                    <div style={contentStyle}>
                        <Image src="https://4rent-thessaloniki.com/images/fleet/aygox.png" style={{ width: "100%", height: "auto" }} />
                    </div>
                    <div style={contentStyle}>
                        <Image src="https://4rent-thessaloniki.com/images/fleet/ibiza.png" style={{ width: "100%", height: "auto" }} />
                    </div>
                    <div style={contentStyle}>
                        <Image src="https://4rent-thessaloniki.com/images/fleet/golf.png" style={{ width: "100%", height: "auto" }} />
                    </div>
                    <div style={contentStyle}>
                        <Image src="https://4rent-thessaloniki.com/images/fleet/arona-site-2.png" style={{ width: "100%", height: "auto" }} />
                    </div>
                    <div style={contentStyle}>
                        <Image src="https://4rent-thessaloniki.com/images/fleet/corolla.png" style={{ width: "100%", height: "auto" }} />
                    </div>
                    <div style={contentStyle}>
                        <Image src="https://4rent-thessaloniki.com/images/fleet/chr.png" style={{ width: "100%", height: "auto" }} />
                    </div>
                    <div style={contentStyle}>
                        <Image src="https://4rent-thessaloniki.com/images/fleet/jogger.png" style={{ width: "100%", height: "auto" }} />
                    </div>
                    <div style={contentStyle}>
                        <Image src="https://4rent-thessaloniki.com/images/fleet/caddy.png" style={{ width: "100%", height: "auto" }} />
                    </div>
                </Carousel>
            </div>

            <Button
                style={{
                    backgroundColor: "#0b9f9a",
                    color: "#fff",
                    padding: "20px 20px",
                    fontSize: "1.2rem",
                    border: "none",
                    cursor: "pointer",
                    margin: "40px 0"
                }}
            >
                {t("btn.selectCategory")}
            </Button>

            <Row gutter={[16, 24]} style={{ width: "60%", marginBottom: "40px" }}>
                <Col className="gutter-row" span={12}>
                    <Space align="start">
                        <Image
                            src="https://4rent-thessaloniki.com/images/Deals/premium-paket2.jpg"
                            style={{ maxWidth: "250px", width: "100%", height: "auto" }}
                            preview={false}
                        />
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                            <a style={{ color: "#ce0505", textAlign: "start", fontSize: "1rem" }}>
                                {t("card.premium.text")}
                            </a>
                            <Button style={{ backgroundColor: "#ce0505", color: "#fff", fontSize: "1.2rem", border: "none", cursor: "pointer" }}>
                                <FontAwesomeIcon icon={faCheck} /> {t("card.premium.badge")}
                            </Button>
                        </div>
                    </Space>
                </Col>

                <Col className="gutter-row" span={12}>
                    <Space align="start">
                        <Image
                            src="https://4rent-thessaloniki.com/images/Logos/car-crash.png"
                            style={{ maxWidth: "250px", width: "100%", height: "auto" }}
                            preview={false}
                        />
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                            <a style={{ color: "#ce0505", textAlign: "start", fontSize: "1rem" }}>
                                {t("card.insurance.text")}
                            </a>
                            <Button style={{ backgroundColor: "#ce0505", color: "#fff", fontSize: "1.2rem", border: "none", cursor: "pointer" }}>
                                <FontAwesomeIcon icon={faCheck} /> {t("card.insurance.badge")}
                            </Button>
                        </div>
                    </Space>
                </Col>

                <Col className="gutter-row" span={12}>
                    <Space align="start">
                        <Image
                            src="https://4rent-thessaloniki.com/images/Logos/5-Sterne.png"
                            style={{ maxWidth: "250px", width: "100%", height: "auto" }}
                            preview={false}
                        />
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                            <a style={{ color: "#ce0505", textAlign: "start", fontSize: "1rem" }}>
                                {t("card.unique.text")}
                            </a>
                            <Button style={{ backgroundColor: "#ce0505", color: "#fff", fontSize: "1.2rem", border: "none", cursor: "pointer" }}>
                                <FontAwesomeIcon icon={faStar} /> {t("card.unique.badge")}
                            </Button>
                        </div>
                    </Space>
                </Col>

                <Col className="gutter-row" span={12}>
                    <Space align="start">
                        <Image
                            src="https://4rent-thessaloniki.com/images/prosfores2024-.png"
                            style={{ maxHeight: "150px", maxWidth: "250px", width: "100%", height: "auto" }}
                            preview={false}
                        />
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                            <a style={{ color: "#ce0505", textAlign: "start", fontSize: "1rem" }}>
                                {t("card.offers.text")}
                            </a>
                            <Button style={{ backgroundColor: "#ce0505", color: "#fff", fontSize: "1.2rem", border: "none", cursor: "pointer" }}>
                                <FontAwesomeIcon icon={faCheck} /> {t("card.offers.badge")}
                            </Button>
                        </div>
                    </Space>
                </Col>
            </Row>
        </>
    );
}

export default MainPage;
