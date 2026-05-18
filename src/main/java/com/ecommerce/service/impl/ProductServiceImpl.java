package com.ecommerce.service.impl;

import com.ecommerce.dto.PagedResponse;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

	@Autowired
	private ProductRepository productRepository;

	private ProductResponse mapToResponse(Product product) {
		ProductResponse response = new ProductResponse();
		response.setProductId(product.getProductId());
		response.setName(product.getName());
		response.setDescription(product.getDescription());
		response.setPrice(product.getPrice());
		response.setStock(product.getStock());
		response.setCategory(product.getCategory());
		response.setImageUrl(product.getImageUrl());
		response.setActive(product.getActive());
		response.setCreatedAt(product.getCreatedAt());
		return response;
	}

	private Sort resolveSort(String sortBy) {
		return switch (sortBy == null ? "newest" : sortBy) {
		case "price_asc" -> Sort.by("price").ascending();
		case "price_desc" -> Sort.by("price").descending();
		case "name_asc" -> Sort.by("name").ascending();
		default -> Sort.by("createdAt").descending(); // newest first
		};
	}

	@Override
	public ProductResponse addProduct(ProductRequest request) {
		Product product = new Product();
		product.setName(request.getName());
		product.setDescription(request.getDescription());
		product.setPrice(request.getPrice());
		product.setStock(request.getStock());
		product.setCategory(request.getCategory());
		product.setImageUrl(request.getImageUrl());
		product.setActive(true);
		return mapToResponse(productRepository.save(product));
	}

	@Override
	public PagedResponse<ProductResponse> getProductsPaged(int page, int size, String sortBy) {
		Pageable pageable = PageRequest.of(page, size, resolveSort(sortBy));
		Page<ProductResponse> result = productRepository.findByActiveTrue(pageable).map(this::mapToResponse);
		return PagedResponse.of(result);
	}

	@Override
	public PagedResponse<ProductResponse> searchProductsPaged(String keyword, String category, int page, int size) {

		String kw = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
		String cat = (category != null && !category.isBlank()) ? category.trim() : null;

		Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
		Page<ProductResponse> result = productRepository.searchActive(kw, cat, pageable).map(this::mapToResponse);
		return PagedResponse.of(result);
	}

	@Override
	public ProductResponse getProductById(Long id) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
		if (!product.getActive()) {
			throw new RuntimeException("Product is not available");
		}
		return mapToResponse(product);
	}

	@Override
	public List<ProductResponse> getAllProducts() {
		return productRepository.findByActiveTrue().stream().map(this::mapToResponse).collect(Collectors.toList());
	}

	@Override
	public List<ProductResponse> searchProducts(String keyword, String category) {
		if (keyword != null && !keyword.isBlank() && category != null && !category.isBlank()) {
			return productRepository.findByNameContainingIgnoreCaseAndActiveTrue(keyword).stream()
					.filter(p -> p.getCategory().equalsIgnoreCase(category)).map(this::mapToResponse)
					.collect(Collectors.toList());
		}
		if (keyword != null && !keyword.isBlank()) {
			return productRepository.findByNameContainingIgnoreCaseAndActiveTrue(keyword).stream()
					.map(this::mapToResponse).collect(Collectors.toList());
		}
		if (category != null && !category.isBlank()) {
			return productRepository.findByCategoryAndActiveTrue(category).stream().map(this::mapToResponse)
					.collect(Collectors.toList());
		}
		return getAllProducts();
	}
}