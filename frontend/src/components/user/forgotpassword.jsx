import { useState } from "react";
import InputField from "../util/InputField";
import '../../css/login.css';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
const InputFieldd = ({ type, placeholder, icon, ...rest }) => {
    return <input type={type} placeholder={placeholder} {...rest} />;
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoader(true);
await axios.post("http://localhost:8080/api/auth/forgot-password", 
  { email }, 
  { withCredentials: false } 
);    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="login-containerr">
      <Toaster position="top-center" />
      <h2 className="form-titlee">Reset your Password</h2>
      <form className="login-form" onSubmit={handleSubmit}>
    <InputField
  type="email"
  id="email"           // ✅ id requis (pas name)
  placeholder="Email address"
  icon="mail"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
        <button type="submit" className="login-button" disabled={loader}>
          {loader ? "Sending..." : "Send Reset Link"}
        </button>
        <p className="signup-prompt">
          Remembered your password?{" "}
          <Link to="/login" className="signup-link">Log in</Link>
        </p>
      </form>
    </div>
  );
}