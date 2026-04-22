package com.ecommerce.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

	private final String SECRET = "mySecretKey1234567890mySecretKey1234567890";
	private final long EXPIRATION = 20000; // 1 day in milliseconds

	private Key getKey() {
		return Keys.hmacShaKeyFor(SECRET.getBytes());
	}

	public String generateToken(String email) {
		return Jwts.builder().setSubject(email).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
				.signWith(getKey(), SignatureAlgorithm.HS256).compact();
	}

	public String extractEmail(String token) {
		return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody().getSubject();
	}

	public boolean isTokenValid(String token) {
		try {
			extractEmail(token);
			return true;
		} catch (JwtException e) {
			return false;
		}
	}
}