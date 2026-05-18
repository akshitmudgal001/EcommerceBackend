package com.ecommerce.service;

import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.PasswordUpdateRequest;
import com.ecommerce.dto.ProfileUpdateRequest;
import com.ecommerce.dto.UserResponse;

public interface UserProfileService {

	// Used by /api/auth/me
	AuthResponse getMe(String email);

	// User profile APIs
	UserResponse getProfile(String email);

	UserResponse updateProfile(String email, ProfileUpdateRequest request);

	void updatePassword(String email, PasswordUpdateRequest request);
}