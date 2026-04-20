import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const PaypalPayment = ({ totalPrice, onSuccess }) => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    // Vérification du montant
    let amount = Number(totalPrice);
    if (isNaN(amount) || amount <= 0) {
        return (
            <Alert severity="error" className="mt-4">
                <AlertTitle>Erreur de montant</AlertTitle>
                Le montant total est invalide (reçu : {totalPrice}). Vérifiez votre panier.
            </Alert>
        );
    }

    const formattedAmount = amount.toFixed(2);

    if (!clientId) {
        return (
            <Alert severity="error" className="mt-4">
                <AlertTitle>Configuration manquante</AlertTitle>
                La clé PayPal n'est pas configurée.
            </Alert>
        );
    }

    return (
    <PayPalScriptProvider options={{ "client-id": clientId }}>
        <div className="flex flex-col items-center justify-center mt-10 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-center mb-2">Complete Payment</h2>
                <p className="text-center text-gray-500 mb-6">
                    Total: <span className="font-bold text-black">${formattedAmount}</span>
                </p>
                <PayPalButtons
                    style={{ layout: "vertical", shape: "rect", color: "gold" }}
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: { value: formattedAmount }
                            }]
                        });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                            onSuccess(details);
                        });
                    }}
                    onError={(err) => {
                        console.error("Erreur PayPal :", err);
                    }}
                />
            </div>
        </div>
    </PayPalScriptProvider>
);
};

export default PaypalPayment;