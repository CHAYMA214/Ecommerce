import InputFieldd from "../util/InputFieldcopy";
import '../../css/login.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function RestPassword() {
  return (
       <div className="login-containerr">
      <h2 className="form-title">Reset Your Password</h2>
      <form  className="login-form">
        <InputFieldd
          type="password"
          placeholder="New password"
            icon="lock"
          required
        />
        <InputFieldd
          type="password"
          placeholder="Confirm password"
            icon="lock"
          required
        />
        <button type="submit" className="login-button">Reset Password</button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}
