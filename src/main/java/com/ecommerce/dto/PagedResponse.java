package com.ecommerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class PagedResponse<T> {
	private List<T> content;
	private int page;
	private int size;
	private long totalElements;
	private int totalPages;
	private boolean last;

	public static <T> PagedResponse<T> of(org.springframework.data.domain.Page<T> page) {
		PagedResponse<T> r = new PagedResponse<>();
		r.setContent(page.getContent());
		r.setPage(page.getNumber());
		r.setSize(page.getSize());
		r.setTotalElements(page.getTotalElements());
		r.setTotalPages(page.getTotalPages());
		r.setLast(page.isLast());
		return r;
	}
}