package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String title;
    private String description;
    private String image;
    private Integer stock;
    private double price;
    private double discount;
    private String genre;           // electronics, fashion, etc.
    private String feature;         // weekly, monthly, etc.
    private List<String> colors;
    private List<String> sizes;
    private List<String> othersph;
    private Long categoryId;
    private Long userId;
}
