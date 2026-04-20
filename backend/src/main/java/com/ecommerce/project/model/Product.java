package com.ecommerce.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
@ToString
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long productId;

    @NotBlank
    @Size(min = 3, message = "Product name must contain atleast 3 characters")
    private String title;

    private String image;

    @NotBlank
    @Size(min = 6, message = "Product description must contain atleast 6 characters")
    private String description;

    private double specialPrice;
    private Integer stock;
    private double price;
    private double discount;
    private String genre;
    private String feature;

    @ElementCollection
    private List<String> colors = new ArrayList<>();

    @ElementCollection
    private List<String> sizes = new ArrayList<>();

    @ElementCollection
    private List<String> othersph = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User user;

    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    private List<CartItem> products = new ArrayList<>();

    // ✅ Constructeur pour DataSeeder
    public Product(String title, String description,
                   double price, double discount,
                   Integer stock, Category category) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.discount = discount;
        this.stock = stock;
        this.category = category;
        this.specialPrice = price - (price * discount / 100);
    }

    public double getSpecialPrice() {
        return specialPrice;
    }
}