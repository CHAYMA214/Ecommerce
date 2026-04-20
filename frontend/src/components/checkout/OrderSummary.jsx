import React, { useState, useEffect } from 'react';
import { formatPriceCalculation } from '../util/formatPrice';

// Fonction utilitaire pour obtenir une URL d'image valide
const getImageUrl = (image) => {
  if (!image) return '/placeholder.png';
  // Chemin local (développement)
  if (image.startsWith('/src') || image.startsWith('/public')) return image;
  // URL absolue
  if (image.startsWith('http')) return image;
  // Sinon, c'est un nom de fichier backend
  return `${import.meta.env.VITE_BACK_END_URL}/images/${image}`;
};

const OrderSummary = ({ address, paymentMethod }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCart(parsedCart);
            } catch (e) {
                console.error("Erreur parsing du panier localStorage", e);
                setCart([]);
            }
        } else {
            setCart([]);
        }
        setLoading(false);
    }, []);

    const totalPrice = cart.reduce((sum, item) => {
        const price = item.specialPrice ?? item.price ?? 0;
        const qty = item.quantity ?? 1;
        return sum + (price * qty);
    }, 0);

    if (loading) {
        return <div className="text-center py-8">Chargement du panier...</div>;
    }

    return (
        <div className="container mx-auto px-4 mb-8">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-8/12 pr-4">
                    <div className="space-y-4">
                        {/* Adresse de livraison */}
                        <div className="p-4 border rounded-lg shadow-xs">
                            <h2 className='text-2xl font-semibold mb-2'>Billing Address</h2>
                            <p><strong>Building Name: </strong>{address?.buildingName || '—'}</p>
                            <p><strong>City: </strong>{address?.city || '—'}</p>
                            <p><strong>Street: </strong>{address?.street || '—'}</p>
                            <p><strong>State: </strong>{address?.state || '—'}</p>
                            <p><strong>Pincode: </strong>{address?.pincode || '—'}</p>
                            <p><strong>Country: </strong>{address?.country || '—'}</p>
                        </div>

                        {/* Moyen de paiement */}
                        <div className='p-4 border rounded-lg shadow-xs'>
                            <h2 className='text-2xl font-semibold mb-2'>Payment Method</h2>
                            <p><strong>Method: </strong>{paymentMethod || 'Not selected'}</p>
                        </div>

                        {/* Articles commandés */}
                        <div className='pb-4 border rounded-lg shadow-xs mb-6'>
                            <h2 className='text-2xl font-semibold mb-2'>Order Items</h2>
                            {cart.length === 0 ? (
                                <p className="text-gray-400 p-4">No items in cart</p>
                            ) : (
                                <div className='space-y-2'>
                                    {cart.map((item) => {
                                        const price = item.specialPrice ?? item.price ?? 0;
                                        const quantity = item.quantity ?? 1;
                                        const lineTotal = price * quantity;
                                        const imageUrl = getImageUrl(item.image);
                                        return (
                                            <div key={item.productId} className='flex items-center gap-3 p-2 border-b'>
                                                <img
                                                    src={imageUrl}
                                                    alt={item.productName || item.title}
                                                    className='w-12 h-12 rounded-sm object-contain'
                                                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                                                />
                                                <div className='flex-1 text-gray-600'>
                                                    <p className='font-medium text-black'>
                                                        {item.productName || item.title}
                                                    </p>
                                                    <p className='text-sm'>
                                                        {quantity} x ${price.toFixed(2)} = ${lineTotal.toFixed(2)}
                                                    </p>
                                                    {item.selectedSize && <p className='text-xs text-gray-400'>Size: {item.selectedSize}</p>}
                                                    {item.selectedColor && (
                                                        <p className='text-xs text-gray-400 flex items-center gap-1'>
                                                            Color: <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: item.selectedColor, border: '1px solid #ccc' }} />
                                                        </p>
                                                    )}
                                                </div>
                                                <div className='font-semibold'>
                                                    ${lineTotal.toFixed(2)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Résumé de la commande */}
                <div className="w-full lg:w-4/12 mt-4 lg:mt-0">
                    <div className="border rounded-lg shadow-xs p-4 space-y-4">
                        <h2 className="text-2xl font-semibold mb-2">Order Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Products</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (0%)</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                                <span>SubTotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;