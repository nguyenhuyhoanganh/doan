package com.doan.appmusic.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.doan.appmusic.security.SecurityConstants;
import org.springframework.security.core.GrantedAuthority;

import java.util.*;

public class JwtUtils {

    public static String generateToken(String subject, long time, String issuer, Map<String, String> claims) {
        Algorithm algorithm = Algorithm.HMAC256(SecurityConstants.SECRET_KEY.getBytes());
        // tạo token
        JWTCreator.Builder jwtBuilder = JWT.create()
                .withSubject(subject)
                .withExpiresAt(new Date(System.currentTimeMillis() + time))
                .withIssuer(issuer);
        for (String name : claims.keySet()) {
            jwtBuilder.withClaim(name, claims.get(name));
        }

        String token = jwtBuilder.sign(algorithm);
        return token;
    }

    public static DecodedJWT decodeToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(SecurityConstants.SECRET_KEY.getBytes());
        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decodedJWT = verifier.verify(token);
        return decodedJWT;
    }

    public static String populateAuthorities(Collection<? extends GrantedAuthority> collection) {
        Set<String> authoritiesSet = new HashSet<>();
        for (GrantedAuthority authority : collection) {
            authoritiesSet.add(authority.getAuthority());
        }
        return String.join(",", authoritiesSet);
    }
}
