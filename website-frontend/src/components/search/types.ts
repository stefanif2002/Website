export type Driver = { telephone: string; name: string };

export type ChecklistEntryDto = { item: string; quantity: number };

export type AddonDef = {
    value: string;            // payload key for backend
    title: string;            // UI label
    description?: string;     // UI subtitle
    price: number;            // flat price (adjust if per-day)
    qty?: boolean;            // quantity supported
};

export type BookingWizardProps = {
    onSubmit: (
        user: string,
        drivers: Driver[],
        flight: string,
        number_of_people: number,
        price: number,
        is_advance_paid: boolean,
        notes: string,
        checklist: ChecklistEntryDto[]
    ) => void;

    baseTotal?: number;
    currency?: string;
    vehicleName?: string;
    vehicleImage?: string;
    pickupLabel?: string;
    dropoffLabel?: string;
};
