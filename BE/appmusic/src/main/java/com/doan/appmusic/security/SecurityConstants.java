package com.doan.appmusic.security;

public class SecurityConstants {
    public static final String SECRET_KEY = "jxgEQeXHuPq8VdbyYFNkANdudQ53YUn4";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final Long ACCESS_TOKEN_LIFE_TIME = 24 * 60 * 60 * 1000L;
    public static final Long REFRESH_TOKEN_LIFE_TIME = 10 * 24 * 60 * 60 * 1000L;
}
