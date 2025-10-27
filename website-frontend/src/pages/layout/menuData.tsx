import React from "react";
import { TFunction } from "i18next";

/** App-level navigation type */
export type NavItem = {
    key: string;
    label: React.ReactNode;
    href?: string;
    children?: NavItem[];
};

export const mainMenuItems = (t: TFunction) =>
    [
        {
            key: "rent",
            label: (
                <span style={{ color: "#ce0505", fontWeight: "bold", textDecoration: "underline", fontSize: "17px" }}>
          ❹rent
        </span>
            ),
            href: "/",
        },
        { key: "booking", label: t("nav.booking"), href: "/search" },
        {
            key: "fleet",
            label: t("nav.fleet.title"),
            children: [
                { key: "fleet-categories", label: t("nav.fleet.categories"), href: "/stolos/diathesimes-katigories-o-stolos-mas" },
                { key: "small-category", label: t("nav.fleet.small"), href: "/stolos/mikri-katigoria-enoikiaseis-autokiniton-thessaloniki" },
                { key: "medium-category", label: t("nav.fleet.medium"), href: "/stolos/mesaia-katigoria-enoikiaseis-autokiniton-thessaloniki" },
                { key: "large-category", label: t("nav.fleet.large"), href: "/stolos/megali-katigoria-enoikiaseis-autokiniton-thessaloniki" },
                { key: "family-category", label: t("nav.fleet.family"), href: "/stolos/oikogeniaki-katigoria-enoikiaseis-autokiniton-thessaloniki" },
                { key: "upper-category", label: t("nav.fleet.upper"), href: "/stolos/anoteri-katigoria-enoikiaseis-autokiniton-thessaloniki" },
                { key: "upper-caravan", label: t("nav.fleet.caravan"), href: "/stolos/karaban-katigoria-enoikiaseis-autokiniton-thessaloniki" },
                { key: "suv", label: t("nav.fleet.suv"), href: "/stolos/suv-jeep-enoikiaseis-autokiniton-thessaloniki" },
                { key: "minivan7", label: t("nav.fleet.minivan7"), href: "/stolos/minivan-7theseis-enoikiaseis-autokiniton-thessaloniki" },
                { key: "minivan9", label: t("nav.fleet.minivan9"), href: "/stolos/minivan-9theseis-enoikiaseis-autokiniton-thessaloniki" },
                { key: "automatic", label: t("nav.fleet.automatic"), href: "/stolos/automato-autokinito-enoikiaseis-thessaloniki" },
                { key: "diesel", label: t("nav.fleet.diesel"), href: "/stolos/petrelaio-autokinito-enoikiaseis-thessaloniki" },
                { key: "luxury", label: t("nav.fleet.luxury"), href: "/stolos/enoikiasi-politeleias-autokinito-thessaloniki" },
            ],
        },
        { key: "offer-2026", label: t("nav.offer2026"), href: "/prosfora-enoikiasi-autokinitou-thessaloniki" },
        { key: "reviews", label: t("nav.reviews"), href: "/enoikiasi-autokinitou-thessaloniki-kritikes" },
        {
            key: "why-us",
            label: t("nav.whyus.title"),
            children: [
                { key: "4rent-vs", label: t("nav.whyus.vs"), href: "/enoikiaseis-autokiniton-thessaloniki/4rent-vs-antagonistis" },
                { key: "premium-service", label: t("nav.whyus.premium"), href: "/enoikiaseis-autokiniton-thessaloniki/ypiresia-premium" },
                { key: "cheap-cars", label: t("nav.whyus.cheap"), href: "/enoikiaseis-autokiniton-thessaloniki/fthina-enoikiazomena-aftokinita-thessaloniki" },
                { key: "full-insurance", label: t("nav.whyus.insurance"), href: "/enoikiaseis-autokiniton-thessaloniki/mikti-asfaleia-xoris-eggyisis" },
                { key: "faq", label: t("nav.whyus.faq"), href: "/enoikiaseis-autokiniton-thessaloniki/syxnes-erotiseis" },
                { key: "chalkidiki", label: t("nav.whyus.chalkidiki"), href: "/enoikiaseis-autokiniton-thessaloniki/enoikiasi-aftokinitou-xalkidiki" },
            ],
        },
        {
            key: "contact",
            label: t("nav.contact.title"),
            children: [
                { key: "contact-us", label: t("nav.contact.us"), href: "/epikoinonia/epikoinoniste-mazi-mas" },
                { key: "terms", label: t("nav.contact.terms"), href: "/epikoinonia/oroi-kai-proipotheseis" },
                { key: "privacy", label: t("nav.contact.privacy"), href: "/epikoinonia/politiki-prostasias-dedomenon" },
                { key: "video-call", label: t("nav.contact.video"), href: "/epikoinonia/epikoinonia-meso-video-call" },
                { key: "sitemap", label: t("nav.contact.sitemap"), href: "/epikoinonia/sitemap" },
                {
                    key: "partners",
                    label: t("nav.contact.partners.title"),
                    children: [
                        {
                            key: "be-partner",
                            label: t("nav.contact.partners.be"),
                            children: [
                                {
                                    key: "hotel-airbnb",
                                    label: t("nav.contact.partners.hotel"),
                                    href: "/epokoinonia/synergates/gine-synergatis/ksenodoxeio-i-airbnb-enoikiasi-autokinitou-thessaloniki",
                                },
                                {
                                    key: "travel-agency",
                                    label: t("nav.contact.partners.agency"),
                                    href: "/epokoinonia/synergates/gine-synergatis/taksidiotiko-grafeio-thessaloniki",
                                },
                            ],
                        },
                    ],
                },
                {
                    key: "careers",
                    label: t("nav.contact.careers"),
                    href: "/epokoinonia/career-theseis-ergasias-rentacar-thessaloniki",
                },
            ],
        },
    ] satisfies NavItem[];
