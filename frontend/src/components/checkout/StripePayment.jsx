// StripePayment.jsx
import { Alert, AlertTitle, Skeleton } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PaymentForm from './PaymentForm';
import { createStripePaymentSecret } from '../actions/action';

// Chargez Stripe avec votre clé publique (à remplacer par la vraie clé)
const stripePromise = loadStripe('pk_test_votre_cle_publique');

const StripePayment = () => {
  const dispatch = useDispatch();
  const { clientSecret } = useSelector((state) => state.auth);
  const { totalPrice } = useSelector((state) => state.carts);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const { user, selectedUserCheckoutAddress } = useSelector((state) => state.auth);

  useEffect(() => {
    // Ne créer un secret que si nécessaire et si totalPrice valide
    if (!clientSecret && totalPrice > 0 && user?.email) {
      const sendData = {
        amount: Number(totalPrice) * 100, // Stripe utilise les centimes
        currency: 'usd',
        email: user.email,
        name: `${user.username}`,
        address: selectedUserCheckoutAddress,
        description: `Order for ${user.email}`,
        metadata: {
          test: '1',
        },
      };
      dispatch(createStripePaymentSecret(sendData));
    }
  }, [clientSecret, totalPrice, user, selectedUserCheckoutAddress, dispatch]);

  // Gestion du chargement
  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto">
        <Skeleton variant="rectangular" height={200} />
      </div>
    );
  }

  // Gestion des erreurs
  if (errorMessage) {
    return (
      <div className="max-w-lg mx-auto">
        <Alert severity="error" variant="filled">
          <AlertTitle>Erreur de paiement</AlertTitle>
          {errorMessage}
        </Alert>
      </div>
    );
  }

  // Affichage du formulaire Stripe uniquement si clientSecret est disponible
  return (
    <>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm clientSecret={clientSecret} totalPrice={totalPrice} />
        </Elements>
      )}
    </>
  );
};

export default StripePayment;