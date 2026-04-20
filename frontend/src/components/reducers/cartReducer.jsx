const initialState = {
  cartItems: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.cartItems.findIndex(
        item => item.variantKey === action.payload.variantKey
      );
      let newCart;
      if (existingIndex !== -1) {
        newCart = [...state.cartItems];
        newCart[existingIndex].quantity = action.payload.quantity;
      } else {
        newCart = [...state.cartItems, action.payload];
      }
      return { ...state, cartItems: newCart };
    }

    case 'INCREASE_CART_QUANTITY': {
      const { variantKey } = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.variantKey === variantKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }

    case 'DECREASE_CART_QUANTITY': {
      const { variantKey } = action.payload;
      return {
        ...state,
        cartItems: state.cartItems
          .map(item =>
            item.variantKey === variantKey
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter(item => item.quantity > 0),
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(
          item => item.variantKey !== action.payload.variantKey
        ),
      };

    default:
      return state;
  }
};