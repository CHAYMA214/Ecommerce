package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.ecommerce.project.model.Category;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Méthode existante pour la pagination par catégorie
    Page<Product> findByCategoryOrderByPriceAsc(Category category, Pageable pageable);

    // Nouvelle méthode : recherche par nom de catégorie normalisé (minuscule + suppression apostrophe)
    @Query("SELECT p FROM Product p WHERE LOWER(REPLACE(p.category.categoryName, '''', '')) = LOWER(REPLACE(:categoryName, '''', ''))")
    List<Product> findByCategoryNameNormalized(@Param("categoryName") String categoryName);

    // Méthode existante pour la recherche par mot-clé
    Page<Product> findByTitleLikeIgnoreCase(String keyword, Pageable pageable);
}