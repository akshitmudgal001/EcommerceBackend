package com.ecommerce.service.impl;

import com.ecommerce.dto.*;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserProfileServiceImpl implements UserProfileService {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	private UserResponse mapUser(User u) {
		UserResponse r = new UserResponse();
		r.setUserId(u.getUserId());
		r.setName(u.getName());
		r.setEmail(u.getEmail());
		r.setRole(u.getRole());
		r.setCreatedAt(u.getCreatedAt());
		return r;
	}

	@Override
	public UserResponse getProfile(String email) {
		return mapUser(userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found")));
	}

	@Override
	public UserResponse updateProfile(String email, ProfileUpdateRequest request) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		user.setName(request.getName().trim());
		return mapUser(userRepository.save(user));
	}

	@Override
	public void updatePassword(String email, PasswordUpdateRequest request) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		// Verify current password
		if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword()))
			throw new RuntimeException("Current password is incorrect");

		// Prevent same password reuse
		if (passwordEncoder.matches(request.getNewPassword(), user.getPassword()))
			throw new RuntimeException("New password must be different from current password");

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);
	}
}