const initialState = {
  products: [],  
  categories: [],
  pagination: {},
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {

    case "FETCH_PRODUCTS":
      return {
        ...state,
        products: action.payload.map(p => ({
          ...p,
          title: p.title ?? p.productName,
          productName: p.productName ?? p.title,
          // ✅ cherche genre dans toutes les structures possibles de l'API
          genre: p.genre 
              ?? p.category?.categoryName 
              ?? p.categoryDTO?.categoryName
              ?? p.categoryName,
          stock: p.stock ?? p.quantity,
          quantity: p.quantity ?? p.stock,
        })),
        pagination: {
          ...state.pagination,
          pageNumber: action.pageNumber,
          pageSize: action.pageSize,
          totalElements: action.totalElements,
          totalPages: action.totalPages,
          lastPage: action.lastPage,
        },
      };

    case "FETCH_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
        pagination: {
          ...state.pagination,
          pageNumber: action.pageNumber,
          pageSize: action.pageSize,
          totalElements: action.totalElements,
          totalPages: action.totalPages,
          lastPage: action.lastPage,
        },
      };

    default:
      return state;
  }
};