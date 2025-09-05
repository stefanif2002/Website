export type AddonDef = {
    value: string;            // payload key for backend
    title: string;            // UI label
    description?: string;     // UI subtitle
    price: number;            // flat price (adjust if per-day)
    qty?: boolean;            // quantity supported
};