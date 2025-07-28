package com.example.website_backend.flags;

public final class UserFlags {
    private UserFlags() {}
    public static final int HAS_NAME               = 1 << 0;
    public static final int HAS_LAST_NAME          = 1 << 1;
    public static final int HAS_EMAIL              = 1 << 2;
    public static final int HAS_ADDRESS            = 1 << 3;
    public static final int HAS_POSTAL_CODE        = 1 << 4;
    public static final int HAS_CITY               = 1 << 5;
    public static final int HAS_COUNTRY            = 1 << 6;
    public static final int HAS_VAT_NUMBER         = 1 << 7;
    public static final int HAS_DRIVER_LICENSE     = 1 << 8;
    public static final int HAS_PASSPORT           = 1 << 9;
    public static final int HAS_PASSPORT_COUNTRY   = 1 << 10;
    public static final int HAS_DL_COUNTRY         = 1 << 11;
    public static final int IS_COMPANY             = 1 << 12;
    public static final int HAS_COMPANY_NAME       = 1 << 13;
}