package com.doan.appmusic.security;

public class SecurityConstants {
    public static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final Long ACCESS_TOKEN_LIFE_TIME = 24 * 60 * 60 * 1000L;
    public static final Long REFRESH_TOKEN_LIFE_TIME = 10 * 24 * 60 * 60 * 1000L;
}
