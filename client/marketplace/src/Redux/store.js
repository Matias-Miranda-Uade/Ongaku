import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';
import reviewsReducer from './slices/reviewsSlice';
import catalogReducer from './slices/catalogSlice';
import adminCatalogReducer from './slices/adminCatalogSlice';
import adminOrdersReducer from './slices/adminOrdersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    reviews: reviewsReducer,
    catalog: catalogReducer,
    adminCatalog: adminCatalogReducer,
    adminOrders: adminOrdersReducer
  }
});
