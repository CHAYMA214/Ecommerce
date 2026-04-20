// components/Header.js
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FaShoppingCart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logOutUser } from '../actions/action';
import toast from 'react-hot-toast';
import '../../css/home.css';
import logo from '../../images/logo-removebg-preview.png';
import Search from './search';

export default function Header({ showPopup, setShowPopup }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.carts.cartItems || []);
  const { user } = useSelector((state) => state.auth);

  const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const toggleCart = () => setShowPopup(prev => !prev);

  const handleLogout = () => {
    toast.success(`Goodbye ${user?.username || ""}`);
    dispatch(logOutUser(navigate));
  };

  const navLinkStyle = "signup";

  return (
    <AppBar position="static" className="headerhome">
      <Toolbar>
        <img src={logo} className="imagehome" alt="logo" />

        <Typography
          className="titlehome"
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <b>Transnoova</b>
        </Typography>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
   <div className="cart-container" onClick={toggleCart} style={{ position: 'relative', cursor: 'pointer' }}>
  <FaShoppingCart color="black" size={24} />
  {totalQuantity > 0 && (
    <span
      style={{
        position: 'absolute',
        top: '-10px',
        right: '-8px',
        backgroundColor: 'red',
        color: 'white',
        fontSize: '12px',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {totalQuantity}
    </span>
  )}
</div>
          <Search />
        </div>

        {!user && (
          <Button color="inherit">
            <Link to="/login" className={navLinkStyle}>Log in</Link>
          </Button>
        )}
        <Button color="inherit">
          <Link to="/Help" className={navLinkStyle}>Help</Link>
        </Button>
        <Button color="inherit">
          <Link to="/login" className={navLinkStyle}>Sell</Link>
        </Button>
        <Button color="inherit">
          <Link to="https://www.linkedin.com/in/" className={navLinkStyle}>About us</Link>
        </Button>

        {user && (
          <Button
            sx={{
              textTransform: 'none',
              color: 'inherit',
              fontSize: '0.875rem',
              padding: '0 8px',
              textDecoration: 'underline'
            }}
            color="inherit"
            onClick={handleLogout}
          >
            <span className="signup">Sign Out</span>
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}