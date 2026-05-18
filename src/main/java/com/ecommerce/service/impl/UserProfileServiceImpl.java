package com.ecommerce.service.impl;

import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.PasswordUpdateRequest;
import com.ecommerce.dto.ProfileUpdateRequest;
import com.ecommerce.dto.UserResponse;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.UserProfileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserProfileServiceImpl implements UserProfileService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	private User loadUser(String email) {
		return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
	}

	private UserResponse mapUser(User user) {
		UserResponse response = new UserResponse();

		response.setUserId(user.getUserId());
		response.setName(user.getName());
		response.setEmail(user.getEmail());
		response.setRole(user.getRole());
		response.setCreatedAt(user.getCreatedAt());

		return response;
	}

	@Override
	@Transactional(readOnly = true)
	public AuthResponse getMe(String email) {

		User user = loadUser(email);

		return new AuthResponse(null, user.getName(), user.getEmail(), user.getRole());
	}

	@Override
	@Transactional(readOnly = true)
	public UserResponse getProfile(String email) {
		return mapUser(loadUser(email));
	}

	@Override
	public UserResponse updateProfile(String email, ProfileUpdateRequest request) {

		User user = loadUser(email);

		String updatedName = request.getName().trim();

		if (updatedName.isBlank()) {
			throw new RuntimeException("Name cannot be empty");
		}

		user.setName(updatedName);

		User savedUser = userRepository.save(user);

		return mapUser(savedUser);
	}

	@Override
	public void updatePassword(String email, PasswordUpdateRequest request) {

		User user = loadUser(email);

		if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {

			throw new RuntimeException("Current password is incorrect");
		}

		if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {

			throw new RuntimeException("New password must be different from current password");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));

		userRepository.save(user);
	}
}