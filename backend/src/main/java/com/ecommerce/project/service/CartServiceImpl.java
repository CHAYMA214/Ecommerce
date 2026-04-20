package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Cart;
import com.ecommerce.project.model.CartItem;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.payload.CartDTO;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.repositories.CartItemRepository;
import com.ecommerce.project.repositories.CartRepository;
import com.ecommerce.project.util.AuthUtil;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ecommerce.project.repositories.ProductRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ModelMapper modelMapper;

    // ✅ UNE SEULE méthode addProductToCart (version corrigée avec gestion des doublons)
    @Override
    public CartDTO addProductToCart(Long productId, Integer quantity) {
        Cart cart = createCart();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        // Récupération de la liste (au lieu d’un objet unique)
        List<CartItem> existingItems = cartItemRepository.findCartItemByProductIdAndCartId(cart.getCartId(), productId);

        // Gestion des doublons
        if (!existingItems.isEmpty()) {
            // Fusionner toutes les quantités
            int totalQuantity = existingItems.stream().mapToInt(CartItem::getQuantity).sum();
            CartItem first = existingItems.get(0);
            first.setQuantity(totalQuantity + quantity);
            cartItemRepository.save(first);
            // Supprimer les autres doublons
            for (int i = 1; i < existingItems.size(); i++) {
                cartItemRepository.delete(existingItems.get(i));
            }
            // Mise à jour du prix total du panier
            cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));
            cartRepository.save(cart);
        } else {
            // Vérifications de stock
            if (product.getStock() == 0) {
                throw new APIException(product.getTitle() + " is not available");
            }
            if (product.getStock() < quantity) {
                throw new APIException("Please, make an order of the " + product.getTitle()
                        + " less than or equal to the quantity " + product.getStock() + ".");
            }

            // Création d’un nouveau CartItem
            CartItem newCartItem = new CartItem();
            newCartItem.setProduct(product);
            newCartItem.setCart(cart);
            newCartItem.setQuantity(quantity);
            newCartItem.setDiscount(product.getDiscount());
            newCartItem.setProductPrice(product.getSpecialPrice());

            cartItemRepository.save(newCartItem);
            cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));
            cartRepository.save(cart);
        }

        // Construction du DTO
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        List<ProductDTO> products = cart.getCartItems().stream()
                .map(item -> {
                    ProductDTO dto = modelMapper.map(item.getProduct(), ProductDTO.class);
                    dto.setStock(item.getQuantity());
                    return dto;
                }).toList();
        cartDTO.setProducts(products);
        return cartDTO;
    }

    @Override
    public List<CartDTO> getAllCarts() {
        List<Cart> carts = cartRepository.findAll();
        if (carts.isEmpty()) {
            throw new APIException("No cart exists");
        }
        return carts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public CartDTO getCart(String emailId, Long cartId) {
        Cart cart = cartRepository.findCartByEmailAndCartId(emailId, cartId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "cartId", cartId);
        }
        return convertToDTO(cart);
    }

    @Transactional
    @Override
    public CartDTO updateProductQuantityInCart(Long productId, Integer quantity) {
        String emailId = authUtil.loggedInEmail();
        Cart userCart = cartRepository.findCartByEmail(emailId);
        Long cartId = userCart.getCartId();

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        if (product.getStock() == 0) {
            throw new APIException(product.getTitle() + " is not available");
        }
        if (product.getStock() < quantity) {
            throw new APIException("Please, make an order of the " + product.getTitle()
                    + " less than or equal to the quantity " + product.getStock() + ".");
        }

        List<CartItem> items = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);
        if (items.isEmpty()) {
            throw new APIException("Product " + product.getTitle() + " not available in the cart!!!");
        }

        CartItem cartItem = items.get(0);
        if (items.size() > 1) {
            int totalQty = items.stream().mapToInt(CartItem::getQuantity).sum();
            cartItem.setQuantity(totalQty);
            for (int i = 1; i < items.size(); i++) {
                cartItemRepository.delete(items.get(i));
            }
            cartItemRepository.save(cartItem);
        }

        int newQuantity = cartItem.getQuantity() + quantity;
        if (newQuantity < 0) {
            throw new APIException("The resulting quantity cannot be negative.");
        }

        if (newQuantity == 0) {
            deleteProductFromCart(cartId, productId);
        } else {
            cartItem.setProductPrice(product.getSpecialPrice());
            cartItem.setQuantity(newQuantity);
            cartItem.setDiscount(product.getDiscount());
            cart.setTotalPrice(cart.getTotalPrice() + (cartItem.getProductPrice() * quantity));
            cartRepository.save(cart);
            cartItemRepository.save(cartItem);
        }

        return convertToDTO(cart);
    }

    private Cart createCart() {
        Cart userCart = cartRepository.findCartByEmail(authUtil.loggedInEmail());
        if (userCart != null) {
            return userCart;
        }
        Cart cart = new Cart();
        cart.setTotalPrice(0.00);
        cart.setUser(authUtil.loggedInUser());
        return cartRepository.save(cart);
    }

    @Transactional
    @Override
    public String deleteProductFromCart(Long cartId, Long productId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        List<CartItem> items = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);
        if (items.isEmpty()) {
            throw new ResourceNotFoundException("Product", "productId", productId);
        }

        for (CartItem item : items) {
            cart.setTotalPrice(cart.getTotalPrice() - (item.getProductPrice() * item.getQuantity()));
            cartItemRepository.delete(item);
        }
        cartRepository.save(cart);
        return "Product " + items.get(0).getProduct().getTitle() + " removed from the cart !!!";
    }

    @Override
    public void updateProductInCarts(Long cartId, Long productId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        List<CartItem> items = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);
        if (items.isEmpty()) {
            throw new APIException("Product " + product.getTitle() + " not available in the cart!!!");
        }

        CartItem cartItem = items.get(0);
        if (items.size() > 1) {
            int totalQty = items.stream().mapToInt(CartItem::getQuantity).sum();
            cartItem.setQuantity(totalQty);
            for (int i = 1; i < items.size(); i++) {
                cartItemRepository.delete(items.get(i));
            }
            cartItemRepository.save(cartItem);
        }

        double cartPrice = cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity());
        cartItem.setProductPrice(product.getSpecialPrice());
        cart.setTotalPrice(cartPrice + (cartItem.getProductPrice() * cartItem.getQuantity()));
        cartItemRepository.save(cartItem);
        cartRepository.save(cart);
    }

    // Helper method
    private CartDTO convertToDTO(Cart cart) {
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        List<ProductDTO> products = cart.getCartItems().stream()
                .map(item -> {
                    ProductDTO dto = modelMapper.map(item.getProduct(), ProductDTO.class);
                    dto.setStock(item.getQuantity());
                    return dto;
                }).toList();
        cartDTO.setProducts(products);
        return cartDTO;
    }
}