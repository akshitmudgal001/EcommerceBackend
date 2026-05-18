package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

	// Non-paginated — still used internally
	List<Product> findByActiveTrue();

	List<Product> findByCategoryAndActiveTrue(String category);

	List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name);

	// Paginated — used by public product listing
	Page<Product> findByActiveTrue(Pageable pageable);

	// Paginated search with optional keyword + category
	@Query("SELECT p FROM Product p WHERE p.active = true "
			+ "AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
			+ "AND (:category IS NULL OR LOWER(p.category) = LOWER(:category))")
	Page<Product> searchActive(@Param("keyword") String keyword, @Param("category") String category, Pageable pageable);
}