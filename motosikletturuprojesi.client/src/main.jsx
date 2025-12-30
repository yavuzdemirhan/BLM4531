import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';


import './index.css'
import './style_contact.css';
import './style_giris.css';
import './style_ipuclari.css';
import './style_kayit.css';
import './style_test.css'; 
import './style_yeni.css';
import './style_home.css';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter> 
    </React.StrictMode>,
)