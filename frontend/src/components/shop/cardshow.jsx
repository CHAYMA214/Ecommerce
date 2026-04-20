// components/More.js
import { useState } from "react";
import Footer from "../home/footer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../actions/action";
import StaticProducts from "./products";

const normalize = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .trim();
};

export default function More() {
  const { genre, title, feature } = useParams();
  const dispatch = useDispatch();

  const safeStaticList = Array.isArray(StaticProducts) ? StaticProducts : [];
  const allProducts = safeStaticList;

  const decodedTitle = normalize(decodeURIComponent(title || ""));
  const decodedGenre = normalize(decodeURIComponent(genre || ""));
  const decodedFeature = normalize(decodeURIComponent(feature || ""));

  const matchTitle = (p) => normalize(p.title) === decodedTitle;
  const matchGenre = (p) =>
    normalize(p.genre) === decodedGenre ||
    normalize(p.category?.categoryName) === decodedGenre ||
    normalize(p.categoryName) === decodedGenre;
  const matchFeature = (p) => normalize(p.feature) === decodedFeature;

  let product = null;
  if (decodedGenre) {
    product = allProducts.find((p) => matchTitle(p) && matchGenre(p));
    if (!product) product = allProducts.find((p) => matchTitle(p));
  } else if (decodedFeature) {
    product = allProducts.find((p) => matchTitle(p) && matchFeature(p));
    if (!product) product = allProducts.find((p) => matchTitle(p));
  }

  if (!product) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" color="error">Product not found</Typography>
        <Typography variant="body2">
          Title: "{title}"<br />
          Genre: "{genre}"<br />
          Feature: "{feature}"
        </Typography>
      </Box>
    );
  }

  const sizes = product.size || product.sizes || [];
  const colors = product.colors || [];
  const stockCount = product.quantity ?? product.stock ?? 0;

  const [selectedSize, setSelectedSize] = useState(sizes.length === 1 ? String(sizes[0]) : "");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const productImages = [product.image, ...(product.othersph || [])].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(productImages[0] || null);

  const isOutOfStock = stockCount === 0;

  const handleColorClick = (color, index) => {
    setSelectedColor(color);
    if (productImages[index]) setSelectedImage(productImages[index]);
  };

  const handleAddToCart = () => {
    if (!selectedSize && sizes.length > 0) {
      toast.info("Please select a size.");
      return;
    }
    if (!selectedColor && colors.length > 0) {
      toast.info("Please select a color.");
      return;
    }

    const productForCart = {
      ...product,
      productId: product.productId,        // ✅ utilise productId défini dans les produits statiques
      productName: product.title,
      selectedSize,
      selectedColor,
      quantity: quantity,
      variantStock: stockCount,
    };

    // 1. Dispatch Redux (met à jour le store et le localStorage via l'action)
    dispatch(addToCart(productForCart, quantity, toast));

    // 2. Sauvegarde supplémentaire dans localStorage (garantie)
    const existingCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingIndex = existingCart.findIndex(
      (item) =>
        item.productId === productForCart.productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );
    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity = quantity;
    } else {
      existingCart.push(productForCart);
    }
    localStorage.setItem("cartItems", JSON.stringify(existingCart));
  };

  return (
    <div>
      <Box sx={{ display: "flex", maxWidth: 1200, margin: "40px auto", gap: 4, px: 2, mb: 30, mt: 10, border: 1, borderColor: "grey.500", p: 2 }}>
        {/* Miniatures */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 80 }}>
          {productImages.map((img, index) => (
            <Box
              key={index}
              component="img"
              src={img}
              alt={`thumbnail ${index}`}
              sx={{
                width: 80,
                height: 80,
                objectFit: "contain",
                border: selectedImage === img ? "2px solid black" : "1px solid #ccc",
                borderRadius: 1,
                cursor: "pointer",
              }}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </Box>

        {/* Main image */}
        <Box
          component="img"
          src={selectedImage}
          alt={product.title}
          sx={{
            flex: 1,
            maxHeight: 400,
            objectFit: "contain",
            borderRadius: 2,
            backgroundColor: "#fafafa",
          }}
        />

        {/* Product details */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
            {product.genre}
          </Typography>

          <Typography variant="h4" fontWeight="bold">
            {product.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.description}
          </Typography>

          <Typography variant="subtitle2" color={isOutOfStock ? "error" : "text.primary"} sx={{ mb: 1 }}>
            {isOutOfStock ? "Out of stock" : `Stock: ${stockCount}`}
          </Typography>

          {/* Size selector */}
          {sizes.length > 0 && (
            <>
              <Typography variant="subtitle2" fontWeight="medium" gutterBottom>Size</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {sizes.map((size) => (
                  <Box
                    key={size}
                    onClick={() => sizes.length > 1 && setSelectedSize(String(size))}
                    sx={{
                      minWidth: 40,
                      height: 40,
                      px: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: selectedSize === String(size) ? "2px solid black" : "1px solid #ccc",
                      borderRadius: 1,
                      cursor: sizes.length === 1 ? "default" : "pointer",
                      fontWeight: selectedSize === String(size) ? "bold" : "normal",
                      backgroundColor: selectedSize === String(size) ? "black" : "transparent",
                      color: selectedSize === String(size) ? "white" : "inherit",
                      fontSize: "0.85rem",
                      transition: "all 0.15s",
                      "&:hover": sizes.length > 1 ? { borderColor: "black" } : {},
                    }}
                  >
                    {size}
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* Color selector */}
          {colors.length > 0 && (
            <>
              <Typography variant="subtitle2" fontWeight="medium" gutterBottom>Color</Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                {colors.map((color, index) => (
                  <Box
                    key={color}
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: color,
                      cursor: "pointer",
                      border: selectedColor === color ? "2px solid black" : "none",
                    }}
                    onClick={() => handleColorClick(color, index)}
                  />
                ))}
              </Box>
            </>
          )}

          {/* Quantity */}
          <Typography variant="subtitle2" fontWeight="medium" gutterBottom>Quantity</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              style={{
                width: 32,
                height: 32,
                fontSize: "1.2rem",
                border: "1px solid #ccc",
                background: "transparent",
                cursor: quantity <= 1 ? "not-allowed" : "pointer",
                borderRadius: 4,
              }}
            >
              −
            </button>
            <Typography variant="body1" fontWeight="bold" sx={{ minWidth: 24, textAlign: "center" }}>
              {quantity}
            </Typography>
            <button
              onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
              disabled={quantity >= stockCount}
              style={{
                width: 32,
                height: 32,
                fontSize: "1.2rem",
                border: "1px solid #ccc",
                background: "transparent",
                cursor: quantity >= stockCount ? "not-allowed" : "pointer",
                borderRadius: 4,
              }}
            >
              +
            </button>
            <Typography variant="body2" color="text.secondary">
              ({stockCount} available)
            </Typography>
          </Box>

          {/* Price */}
          {product.discount > 0 ? (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="body1" sx={{ textDecoration: "line-through", color: "grey.600" }}>
                {Number(product.price).toFixed(2)} TND
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="error">
                {(Number(product.price) - (Number(product.price) * Number(product.discount)) / 100).toFixed(2)} TND
              </Typography>
              <Typography variant="body2" color="success.main">
                -{Number(product.discount)}%
              </Typography>
            </Box>
          ) : (
            <Typography variant="h5" fontWeight="bold">
              {Number(product.price).toFixed(2)} TND
            </Typography>
          )}

          <Button variant="outlined" sx={{ maxWidth: 200 }} disabled={isOutOfStock} onClick={handleAddToCart}>
            {isOutOfStock ? "Out of stock" : "Add to basket"}
          </Button>
        </Box>
      </Box>
      <ToastContainer />
      <Footer />
    </div>
  );
}