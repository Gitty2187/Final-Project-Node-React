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
import { configureStore } from '@reduxjs/toolkit'
import apartmentDetails from './Store/ApartmentSlice'
import buildingDetails from './Store/BuildingSlice'
import token from './Store/Token'
import AllApartments from './Store/AllApartment'
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"

const myStore = configureStore({
  reducer: {
    apartmentDetails,
    buildingDetails,
    token,
    AllApartments
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <PrimeReactProvider>
      <Provider store={myStore}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </PrimeReactProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
