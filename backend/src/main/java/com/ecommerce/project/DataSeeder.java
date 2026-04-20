package com.ecommerce.project;

import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.repositories.CategoryRepository;
import com.ecommerce.project.repositories.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataSeeder(CategoryRepository categoryRepository,
                      ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return;

        // 1. Création des catégories (identiques au frontend)
        Category kids = categoryRepository.save(new Category("Kid's"));
        Category women = categoryRepository.save(new Category("Women's"));
        Category garden = categoryRepository.save(new Category("garden"));
        Category men = categoryRepository.save(new Category("Men's"));
        Category electronics = categoryRepository.save(new Category("electronics"));
        Category beauty = categoryRepository.save(new Category("beauty's"));
        Category pets = categoryRepository.save(new Category("pet's"));

        // 2. Insertion des produits (avec genre, feature, sizes, colors, othersph)
        // Ladies Short Sleeve Dress
        Product p1 = new Product("Ladies Short Sleeve Dress",
                "WEACZZY Women's Summer Short Sleeve Casual Dresses V-Neck Floral Party Dress with Pockets",
                30.00, 10.00, 25, women);
        p1.setGenre("Women's");
        p1.setFeature("today");
        p1.setSizes(Arrays.asList("S", "M", "L", "XL"));
        p1.setColors(Arrays.asList("green", "#d500f9"));
        p1.setOthersph(List.of("/src/images/women/3.jpg")); // exemple d'image supplémentaire
        productRepository.save(p1);

        // Oil Soap Wood Home Cleaner
        Product p2 = new Product("Oil Soap Wood Home Cleaner",
                "Murphy Oil Soap, Original Formula - 90 fl oz (4PK)",
                15.22, 10.00, 50, garden);
        p2.setGenre("garden");
        p2.setFeature("today");
        p2.setSizes(List.of("One Size"));
        p2.setColors(List.of("green"));
        productRepository.save(p2);

        // FREEDOM Garden Hose
        Product p3 = new Product("FREEDOM Garden Hose",
                "FREEDOM Garden Hose Reel equipped with 5/8' 100ft, Kink-Free Hybrid Hose, Portable and Wall-Mountable, Lightweight, Easy Setup. Spray Nozzle and Leader Hose Included",
                11.70, 10.00, 30, garden);
        p3.setGenre("garden");
        p3.setFeature("normal");
        p3.setSizes(List.of("One Size"));
        p3.setColors(List.of("purple"));
        productRepository.save(p3);

        // Men Leather Formal Shoes
        Product p4 = new Product("Men Leather Formal Shoes",
                "Men's Dress Shoes Genuine Leather Oxfords Luxury Formal Business Suit Shoes with Blake Rapid Stitch",
                220.00, 10.00, 20, men);
        p4.setGenre("Men's");
        p4.setFeature("normal");
        p4.setSizes(Arrays.asList(39, 40, 41, 42, 43, 44).stream().map(String::valueOf).toList());
        p4.setColors(Arrays.asList("#000000", "#D2B48C", "grey"));
        productRepository.save(p4);

        // Gaming Laptop Pro
        Product p5 = new Product("Gaming Laptop Pro",
                "2025 Gaming Laptop 15.6 Inch Laptop Computer with AMD Ryzen 7 5700U Processor, 32GB RAM, 1T SSD, FHD Display 1920*1080P, Windows 11 PRO, WiFi 5, Backlit Keyboard HDMI, for Student, Office, Business",
                3500.00, 10.00, 0, electronics);
        p5.setGenre("electronics");
        p5.setFeature("weekly");
        p5.setSizes(List.of("One Size"));
        p5.setColors(List.of("#000000"));
        productRepository.save(p5);

        // Ladies Leather Handbag
        Product p6 = new Product("Ladies Leather Handbag",
                "HESHE Genuine Leather Purses and Handbags for Women Tote Shoulder Bag Satchel Purse Top Handle Bags Hobo Crossbody Purse",
                120.00, 10.00, 18, women);
        p6.setGenre("Women's");
        p6.setFeature("weekly");
        p6.setSizes(List.of("One Size"));
        p6.setColors(Arrays.asList("#763300", "#000000"));
        productRepository.save(p6);

        // Men Stainless Steel Watch
        Product p7 = new Product("Men Stainless Steel Watch",
                "Movado Bold Verso Men's Sport Watch - Swiss Quartz Movement, Stainless Steel Link Bracelet - 5 ATM Water Resistance - Luxury Fashion Timepiece for Him - 42mm",
                450.00, 10.00, 22, men);
        p7.setGenre("Men's");
        p7.setFeature("weekly");
        p7.setSizes(List.of("One Size"));
        p7.setColors(Arrays.asList("#004d7a", "#EFBF04", "#C4C4C4"));
        productRepository.save(p7);

        // Floral Perfume
        Product p8 = new Product("Floral Perfume",
                "Leave In Conditioner Spray, Hair Perfume for Women, Hair Spray Women with Vitamin B5, Moisturizing & Nourishing Damaged Hair, Daily Hair Repair Mist, Floral, 2.5 Fl Oz",
                75.00, 10.00, 35, beauty);
        p8.setGenre("beauty's");
        p8.setFeature("normal");
        p8.setSizes(List.of("One Size"));
        p8.setColors(Arrays.asList("yellow", "orange"));
        productRepository.save(p8);

        // iPhone New Model
        Product p9 = new Product("iPhone New Model",
                "Apple iPhone SE 3rd Gen, 64GB, Midnight - Unlocked (Renewed)",
                499.00, 10.00, 12, electronics);
        p9.setGenre("electronics");
        p9.setFeature("today");
        p9.setSizes(List.of("One Size"));
        p9.setColors(Arrays.asList("#000000", "red"));
        productRepository.save(p9);

        // Kids Cotton T-Shirt
        Product p10 = new Product("Kids Cotton T-Shirt",
                "Family Feeling Boys Short Sleeve Crewneck Kids T-Shirts Top Girls Tee",
                18.90, 10.00, 40, kids);
        p10.setGenre("Kid's");
        p10.setFeature("normal");
        p10.setSizes(Arrays.asList("XS", "S", "M", "L"));
        p10.setColors(Arrays.asList("#000000", "#EDE8D0"));
        productRepository.save(p10);

        // Luxury Lipstick
        Product p11 = new Product("Luxury Lipstick",
                "LAURA GELLER NEW YORK Italian Marble Sheer Lipstick - Berry Vanilla - Hydrating & Lightweight - Vitamin E & Caster Seed Oil - Cream Finish",
                45.00, 10.00, 28, beauty);
        p11.setGenre("beauty's");
        p11.setFeature("weekly");
        p11.setSizes(List.of("One Size"));
        p11.setColors(Arrays.asList("#EED9C4", "#7b0000"));
        productRepository.save(p11);

        // Dog Chew Toy
        Product p12 = new Product("Dog Chew Toy",
                "Benebone Natural Rubber Dog Bone Chew Toy, Natural Rubber",
                25.00, 10.00, 50, pets);
        p12.setGenre("pet's");
        p12.setFeature("normal");
        p12.setSizes(List.of("One Size"));
        p12.setColors(List.of("#CCFF00"));
        productRepository.save(p12);

        // Baby Romper Suit
        Product p13 = new Product("Baby Romper Suit",
                "Baby Boy Suit Formal Gentleman Wedding Romper Jumpsuit Set Outfit Tuxedo",
                50.00, 10.00, 30, kids);
        p13.setGenre("Kid's");
        p13.setFeature("normal");
        p13.setSizes(Arrays.asList("XS", "S", "M"));
        p13.setColors(Arrays.asList("#00d6ff", "#763300"));
        productRepository.save(p13);

        // Cat Food Bowl
        Product p14 = new Product("Cat Food Bowl",
                "Kitty City Raised Cat Ear Bowls, Small Bowls 2pk (Modern)",
                15.00, 10.00, 45, pets);
        p14.setGenre("pet's");
        p14.setFeature("today");
        p14.setSizes(List.of("One Size"));
        p14.setColors(Arrays.asList("#EDE8D0", "#00d6ff"));
        productRepository.save(p14);

        // Large Pendant Light Ceiling
        Product p15 = new Product("Large Pendant Light Ceiling",
                "Modern large pendant light for garden or indoor ceiling decoration",
                11.70, 10.00, 20, garden);
        p15.setGenre("garden");
        p15.setFeature("weekly");
        p15.setSizes(List.of("One Size"));
        p15.setColors(List.of());
        productRepository.save(p15);

        // Sport Sneakers Unisex (Men's)
        Product p16 = new Product("Sport Sneakers Unisex",
                "Comfortable sport sneakers suitable for running and casual wear",
                120.00, 10.00, 25, men);
        p16.setGenre("Men's");
        p16.setFeature("weekly");
        p16.setSizes(Arrays.asList(39, 40, 41, 42, 43, 44).stream().map(String::valueOf).toList());
        p16.setColors(List.of());
        productRepository.save(p16);

        // Sport Sneakers Unisex (Women's)
        Product p17 = new Product("Sport Sneakers Unisex",
                "Comfortable sport sneakers designed for women, perfect for casual and sport activities",
                120.00, 10.00, 25, women);
        p17.setGenre("Women's");
        p17.setFeature("normal");
        p17.setSizes(Arrays.asList(36, 37, 38, 39, 40, 41).stream().map(String::valueOf).toList());
        p17.setColors(List.of());
        productRepository.save(p17);

        // Wireless Bluetooth Headphones
        Product p18 = new Product("Wireless Bluetooth Headphones",
                "High-quality wireless Bluetooth headphones with long battery life",
                89.90, 10.00, 30, electronics);
        p18.setGenre("electronics");
        p18.setFeature("weekly");
        p18.setSizes(List.of("One Size"));
        p18.setColors(List.of());
        productRepository.save(p18);

        // Waterproof Travel Backpack
        Product p19 = new Product("Waterproof Travel Backpack",
                "Durable and waterproof backpack ideal for travel and outdoor activities",
                65.50, 10.00, 28, men);
        p19.setGenre("Men's");
        p19.setFeature("weekly");
        p19.setSizes(List.of("One Size"));
        p19.setColors(List.of());
        productRepository.save(p19);

        // Smartwatch Series 6
        Product p20 = new Product("Smartwatch Series 6",
                "Smartwatch with multiple features including fitness tracking and notifications",
                350.00, 10.00, 18, electronics);
        p20.setGenre("electronics");
        p20.setFeature("weekly");
        p20.setSizes(List.of("One Size"));
        p20.setColors(List.of());
        productRepository.save(p20);

        // Automatic Coffee Machine
        Product p21 = new Product("Automatic Coffee Machine",
                "Automatic coffee machine for brewing fresh and hot coffee at home",
                280.00, 10.00, 12, electronics);
        p21.setGenre("electronics");
        p21.setFeature("weekly");
        p21.setSizes(List.of("One Size"));
        p21.setColors(List.of());
        productRepository.save(p21);

        // Polarized Sunglasses
        Product p22 = new Product("Polarized Sunglasses",
                "Stylish polarized sunglasses providing UV protection and comfort",
                45.00, 10.00, 20, men);
        p22.setGenre("Men's");
        p22.setFeature("weekly");
        p22.setSizes(List.of("One Size"));
        p22.setColors(List.of());
        productRepository.save(p22);

        // Digital Camera 24MP
        Product p23 = new Product("Digital Camera 24MP",
                "High-resolution 24MP digital camera for photography enthusiasts",
                599.00, 10.00, 15, electronics);
        p23.setGenre("electronics");
        p23.setFeature("weekly");
        p23.setSizes(List.of("One Size"));
        p23.setColors(List.of());
        productRepository.save(p23);

        // Garden Plant
        Product p24 = new Product("Garden Plant",
                "Beautiful and healthy garden plant, perfect for indoor or outdoor decoration.",
                30.00, 10.00, 15, garden);
        p24.setGenre("garden");
        p24.setFeature("today");
        p24.setSizes(List.of("One Size"));
        p24.setColors(List.of());
        productRepository.save(p24);

        System.out.println("✅ 24 produits insérés avec succès (genre, feature, sizes, colors inclus) !");
    }
}