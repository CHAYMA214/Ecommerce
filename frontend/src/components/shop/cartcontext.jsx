import "../../css/home.css";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, increaseCartQuantity, decreaseCartQuantity } from "../../actions/action";
import { toast } from "react-hot-toast";

export default function CartContent() {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.carts);

  const handlePlus = (item) => {
    dispatch(increaseCartQuantity(item, toast, item.quantity, () => {}));
  };

  const handleMinus = (item) => {
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
    <>
      {cart.map((item) => (
        <div
          key={item.productId}
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
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRight: "1px solid #ccc",
            paddingRight: "10px",
          }}>
            <button
              style={{ border: "none", background: "transparent", fontSize: "1.2rem", cursor: "pointer" }}
              onClick={() => handlePlus(item)}
            >+</button>
            <span>{item.quantity || 1}</span>
            <button
              style={{ border: "none", background: "transparent", fontSize: "1.2rem", cursor: "pointer" }}
              onClick={() => handleMinus(item)}
            >−</button>
          </div>

          {/* Image */}
          <img
            src={item.image}
            alt="Product"
            style={{ width: "80px", objectFit: "contain" }}
          />

          {/* Details */}
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
              <span style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: item.selectedColor || "transparent",
                borderRadius: "50%",
                marginLeft: "5px",
              }} />
            </div>
          </div>

          {/* Price & remove */}
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
    </>
  );
}