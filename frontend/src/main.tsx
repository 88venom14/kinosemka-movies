import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { useAuthStore } from './stores/authStore.ts'

// Проверка авторизации при загрузке
useAuthStore.getState().checkAuth();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
