'use client';
import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';

export default function Footer() {
    const { isAuthenticated, logout } = useAuthStore();
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    <div>
                        <h3 className="footer__title">Киносемка</h3>
                        <p className="footer__text">Премиальный опыт просмотра кино с хирургической точностью и вниманием к деталям.</p>
                    </div>
                    <div>
                        <h4 className="footer__subtitle">Фильмы</h4>
                        <ul className="footer__links">
                            <li><Link href="/movies" className="footer__link">Сейчас в кино</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="footer__subtitle">Аккаунт</h4>
                        <ul className="footer__links">
                            {isAuthenticated ? (
                                <>
                                    <li><Link href="/dashboard" className="footer__link">Мои бронирования</Link></li>
                                    <li><button onClick={logout} className="footer__logout-btn">Выйти</button></li>
                                </>
                            ) : (
                                <>
                                    <li><Link href="/login" className="footer__link">Войти</Link></li>
                                    <li><Link href="/register" className="footer__link">Регистрация</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="footer__bottom">
                    <p>&copy; {new Date().getFullYear()} Киносемка. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
}
