package com.ecommerce.service;

import com.ecommerce.dto.*;

public interface UserProfileService {
	UserResponse getProfile(String email);

	UserResponse updateProfile(String email, ProfileUpdateRequest request);

	void updatePassword(String email, PasswordUpdateRequest request);
}