package com.example.website_backend.flags;

public final class BitMask {
    private BitMask() {}
    public static boolean isSet(int flags, int bit)   { return (flags & bit) != 0; }
}