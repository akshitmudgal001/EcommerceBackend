package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

	@Autowired
	private AuthService authService;
	@Autowired
	private UserProfileService userProfileService;

	// No UserRepository here — service layer only

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.ok(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}

	@GetMapping("/me")
	public ResponseEntity<AuthResponse> me(@AuthenticationPrincipal UserDetails userDetails) {
		return ResponseEntity.ok(userProfileService.getMe(userDetails.getUsername()));
	}
}