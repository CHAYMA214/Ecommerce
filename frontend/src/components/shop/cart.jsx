// components/Cart.js
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  removeFromCart,
  increaseCartQuantity,
  decreaseCartQuantity,
} from "../actions/action";

export default function Cart({ showPopup, setShowPopup }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.carts);

  const getImageUrl = (image) => {
    if (!image) return '/placeholder.png';
    if (image.startsWith('/src') || image.startsWith('/public')) return image;
    if (image.startsWith('http')) return image;
    return image;
  };

  const subtotal = (cartItems || [])
    .reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0)
    .toFixed(2);

  if (!showPopup) return null;

  const goToCheckout = () => {
    setShowPopup(false);
    navigate("/checkout");
  };

  const handlePlusQuantity = (item) => {
    dispatch(increaseCartQuantity(item, toast, item.quantity, () => {}));
  };

  const handleMinusQuantity = (item) => {
    if ((item.quantity || 1) <= 1) {
      dispatch(removeFromCart(item, toast));
    } else {
      dispatch(decreaseCartQuantity(item, item.quantity - 1));
    }
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart(item, toast));
  };

  return (
    <div
      className="popup"
      style={{
        position: "absolute",
        top: "40px",
        right: 0,
        backgroundColor: "white",
        border: "1px solid #ccc",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 1000,
        height: 700,
        width: 400,
        display: "flex",
        flexDirection: "column",
        marginLeft: "auto",
      }}
    >
      <button
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "1.2rem",
        }}
        onClick={() => setShowPopup(false)}
      >
        ✖
      </button>

      <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <strong style={{ color: "black", fontSize: 25 }}>
          My Basket{" "}
          <span style={{ color: "grey", fontSize: 15 }}>
            ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
          </span>
        </strong>
      </div>

      <div style={{ flexGrow: 1, overflowY: "auto", padding: "10px" }}>
        {cartItems.map((item) => (
          <div
            key={item.variantKey} // ← clé unique par variante
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              padding: "10px",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            {/* Quantity controls */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRight: "1px solid #ccc",
                paddingRight: "10px",
              }}
            >
              <button
                style={{ border: "none", background: "transparent", fontSize: "1.2rem", cursor: "pointer" }}
                onClick={() => handlePlusQuantity(item)}
              >
                +
              </button>
              <span>{item.quantity || 1}</span>
              <button
                style={{ border: "none", background: "transparent", fontSize: "1.2rem", cursor: "pointer" }}
                onClick={() => handleMinusQuantity(item)}
              >
                −
              </button>
            </div>

            {/* Image */}
            <img
              src={getImageUrl(item.image)}
              alt="Product"
              style={{ width: "80px", objectFit: "contain" }}
              onError={(e) => { e.target.src = '/placeholder.png'; }}
            />
            {/* Info */}
            <div style={{ flexGrow: 1 }}>
              <strong style={{ cursor: "pointer", color: "black" }}>
                {item.productName ?? item.title}
              </strong>
              <div style={{ fontSize: "0.85rem", color: "gray" }}>
                Quantity: <span style={{ color: "black" }}>{item.quantity || 1}</span>
                <br />
                Size: <strong>{item.selectedSize || "N/A"}</strong>
                <br />
                Color: {item.selectedColor || "N/A"}
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: item.selectedColor || "transparent",
                    borderRadius: "50%",
                    marginLeft: "5px",
                  }}
                />
              </div>
            </div>

            {/* Price + remove */}
            <div style={{ textAlign: "right" }}>
              <strong>{item.price} TND</strong>
              <button
                style={{
                  border: "1px solid #ccc",
                  background: "transparent",
                  cursor: "pointer",
                  padding: "4px 6px",
                  marginLeft: "8px",
                }}
                onClick={() => handleRemove(item)}
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <p
        style={{
          color: "grey",
          fontSize: 15,
          bottom: 5,
          position: "absolute",
          left: 30,
          display: "flex",
          flexDirection: "column",
        }}
      >
        Subtotal Amount:
        <span style={{ color: "black", fontSize: 25 }}>{subtotal} TND</span>
      </p>

      {/* Checkout button */}
      <button
        style={{
          margin: 15,
          position: "absolute",
          bottom: 5,
          right: 5,
          border: "1px solid #ccc",
          background: "gray",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          cursor: "pointer",
          fontSize: "1.2rem",
          padding: "5px 10px",
          color: "white",
        }}
        onClick={goToCheckout}
      >
        Check out
      </button>
    </div>
  );
}