package com.ecommerce.security;

import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		com.ecommerce.entity.User appUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

		// Use ROLE_ prefix explicitly so hasRole() and hasAuthority() both work
		return org.springframework.security.core.userdetails.User.withUsername(appUser.getEmail())
				.password(appUser.getPassword())
				.authorities(List.of(new SimpleGrantedAuthority("ROLE_" + appUser.getRole()))).build();
	}
}