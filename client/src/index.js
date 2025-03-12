import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';

// ה-Reducers שלך
import apartmentDetails from './Store/ApartmentSlice';
import buildingDetails from './Store/BuildingSlice';
import token from './Store/Token';
import Allapartments from './Store/AllApartment';

const rootReducer = combineReducers({
    apartmentDetails,
    buildingDetails,
    token,
    Allapartments
});

// יצירת הגדרות persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cx`','buildingDetails','apartmentDetails','token'] 
};

// יצירת Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// יצירת ה-Store
const myStore = configureStore({
  reducer : persistedReducer
});

// יצירת persistor
const persistor = persistStore(myStore);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PrimeReactProvider>
    <Provider store={myStore}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </PrimeReactProvider>
);

reportWebVitals();
