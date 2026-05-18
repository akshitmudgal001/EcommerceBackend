package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserProfileController {

	@Autowired
	private UserProfileService userProfileService;

	@GetMapping("/profile")
	public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
		return ResponseEntity.ok(userProfileService.getProfile(userDetails.getUsername()));
	}

	@PutMapping("/profile")
	public ResponseEntity<UserResponse> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
			@Valid @RequestBody ProfileUpdateRequest request) {
		return ResponseEntity.ok(userProfileService.updateProfile(userDetails.getUsername(), request));
	}

	@PutMapping("/profile/password")
	public ResponseEntity<Map<String, String>> updatePassword(@AuthenticationPrincipal UserDetails userDetails,
			@Valid @RequestBody PasswordUpdateRequest request) {
		userProfileService.updatePassword(userDetails.getUsername(), request);
		return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
	}
}