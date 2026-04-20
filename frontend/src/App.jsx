import './App.css';
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Cart from '../src/components/shop/cart'
import { Routes, Route } from 'react-router-dom';
import Signup from './components/user/signup';
import Login from './components/user/loginin';
import ForgotPassword from './components/user/forgotpassword';
import RestPassword from './components/user/resetpassword';
import Header from './components/home/header';
import Footer from './components/home/footer';
import Content from './components/home/content';
import More from './components/shop/cardshow';
import Categories from './components/shop/categoriescard';
import Search from './components/home/search';
import Checkout from './components/checkout/Checkout';
import ProtectedRoute from './components/util/protectedroute';
import PublicRoute from './components/util/publicroute';
import { fetchProducts } from "../src/components/actions/action";

// App.js (extrait modifié)
function App() {
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts("pageNumber=0&pageSize=100"));
  }, []);

  const headerProps = { showPopup, setShowPopup }; 

  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <>
            <Header {...headerProps} />
            <Cart showPopup={showPopup} setShowPopup={setShowPopup} />
            <Content />
            <Footer />
          </>
        </ProtectedRoute>
      }/>

      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/restpassword" element={<RestPassword />} />

      <Route path="/category/:genre" element={
        <>
          <Header {...headerProps} />
          <Cart showPopup={showPopup} setShowPopup={setShowPopup} />
          <Categories />
        </>
      }/>

      <Route path="/feature/:feature" element={
        <>
          <Header {...headerProps} />
          <Cart showPopup={showPopup} setShowPopup={setShowPopup} />
          <Categories />
        </>
      }/>

      <Route path="/category/:genre/:title" element={
        <>
          <Header {...headerProps} />
          <Cart showPopup={showPopup} setShowPopup={setShowPopup} />
          <More />
          <Search />
        </>
      }/>

      <Route path="/feature/:feature/:title" element={
        <>
          <Header {...headerProps} />
          <Cart showPopup={showPopup} setShowPopup={setShowPopup} />
          <More />
        </>
      }/>

      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}

export default App;