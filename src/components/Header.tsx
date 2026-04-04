'use client';
import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';

export default function Header() {
    const { isAuthenticated, user, logout } = useAuthStore();
    return (
        <header className="header">
            <div className="container header__inner">
                <Link href="/" className="header__logo">Кино<span className="header__logo-accent">Семка</span></Link>
                <nav className="header__nav">
                    <ul className="header__nav-list">
                        <li><Link href="/" className="header__nav-link">Главная</Link></li>
                        <li><Link href="/movies" className="header__nav-link">Фильмы</Link></li>
                        <li><Link href="/dashboard" className="header__nav-link">Аккаунт</Link></li>
                    </ul>
                </nav>
                <div className="header__actions">
                    {isAuthenticated ? (
                        <>
                            <Link href="/dashboard" className="header__user-link">{user?.name || 'Профиль'}</Link>
                            <button onClick={logout} className="header__logout-btn">Выйти</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="header__login-link">Войти</Link>
                            <Link href="/register" className="header__register-link">Регистрация</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
