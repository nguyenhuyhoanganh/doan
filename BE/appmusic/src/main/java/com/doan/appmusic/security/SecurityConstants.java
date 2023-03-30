package com.doan.appmusic.security;

public class SecurityConstants {
    public static final String SECRET_KEY = "g*]gyD#^H[UZ$+Tk<(&Kj0u_~>Xh7Lx3qo{VpJ;flw@btvCA2Qs1RzNmi9aIc6e4E)SndM5B|O8P=`";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final Long ACCESS_TOKEN_LIFE_TIME = 100 * 24 * 60 * 60 * 1000L; // 100 days
    public static final Long REFRESH_TOKEN_LIFE_TIME = 10 * 24 * 60 * 60 * 1000L;
}
