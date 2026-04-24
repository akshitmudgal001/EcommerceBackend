package com.ecommerce.config;

import com.ecommerce.security.CustomUserDetailsService;
import com.ecommerce.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity // explicitly enables Spring Security's web support
public class SecurityConfig {

	@Autowired
	private JwtFilter jwtFilter;

	@Autowired
	private CustomUserDetailsService customUserDetailsService;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				// Disable CSRF — not needed for stateless JWT APIs
				.csrf(csrf -> csrf.disable())

				// Stateless — no server-side sessions, each request must carry JWT
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				// Define which routes need authentication
				.authorizeHttpRequests(auth -> auth
						// Public routes — no token needed
						.requestMatchers("/api/auth/register").permitAll().requestMatchers("/api/auth/login")
						.permitAll()

						// All other routes require a valid JWT token
						.anyRequest().authenticated())

				// Wire in our custom authentication provider
				// This tells Spring to use our DB + BCrypt to verify passwords
				.authenticationProvider(authenticationProvider())

				// Add our JWT filter BEFORE Spring's default login filter
				// So our filter runs first, reads the token, sets authentication
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	// This bean connects Spring Security's login mechanism to our database
	// When authenticationManager.authenticate() is called during login,
	// it uses this provider to: load user from DB → verify BCrypt password
	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setUserDetailsService(customUserDetailsService); // load from DB
		provider.setPasswordEncoder(passwordEncoder()); // verify BCrypt
		return provider;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}