// useLangRouter.ts
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, type NavigateOptions } from "react-router-dom";

const LANG_REGEX = /^[a-z]{2}$/i;

export const getLangFromPath = (path?: string): string => {
    const pathname = path ?? (typeof window !== "undefined" ? window.location.pathname : "");
    const seg = (pathname.split("/")[1] || "").trim();
    return LANG_REGEX.test(seg) ? seg : "el-GR";
};

const isExternal = (p: string) =>
    /^(https?:)?\/\//i.test(p) || /^mailto:/i.test(p) || /^tel:/i.test(p);

/** Usable anywhere (services too): returns path prefixed with current lang. */
export const withLang = (p: string, lang = getLangFromPath()): string => {
    if (!p) return `/${lang}/`;
    if (isExternal(p)) return p;                 // keep external URLs intact
    if (/^\/[a-z]{2}(\/|$)/i.test(p)) return p;  // already prefixed
    const normalized = p.startsWith("/") ? p : `/${p}`;
    return `/${lang}${normalized}`;
};

export function useLangRouter() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const lang = useMemo(() => getLangFromPath(pathname), [pathname]);

    // path builder that closes over current lang
    const to = useCallback((p: string) => withLang(p, lang), [lang]);

    // programmatic navigation with correct typing
    const go = useCallback(
        (p: string, opts?: NavigateOptions) => navigate(to(p), opts),
        [navigate, to]
    );

    // convenience replace()
    const replace = useCallback(
        (p: string, state?: unknown) => navigate(to(p), { replace: true, state }),
        [navigate, to]
    );

    return { lang, to, go, replace };
}
