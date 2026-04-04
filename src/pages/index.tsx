import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/Button';
import { useAuthStore } from '@/stores/authStore';
import { Movie } from '@/types';

export default function Home() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    return (
        <div className="min-h-screen">
            <Head><title>КиноСемка — Главная</title></Head>

            <section className="hero">
                <div className="hero__bg" />
                <div className="hero__content">
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="hero__title">
                        Добро пожаловать в Киношку
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="hero__subtitle">
                        Премиальный опыт бронирования кинобилетов. Выберите свой идеальный сеанс.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="hero__buttons">
                        <Link href="/movies" className="hero__btn hero__btn--primary">Смотреть фильмы</Link>
                        {!isAuthenticated
                            ? <Link href="/login" className="hero__btn hero__btn--outline">Войти</Link>
                            : <button onClick={() => router.push('/dashboard')} className="hero__btn hero__btn--outline">Личный кабинет</button>
                        }
                    </motion.div>
                </div>
            </section>

            <section className="features">
                <div className="max-w-6xl mx-auto">
                    <div className="features__grid">
                        {[
                            { title: 'Премиум места', description: 'Выбирайте между стандартными и VIP местами с повышенным комфортом' },
                            { title: 'Мгновенное бронирование', description: 'Забронируйте билеты за несколько кликов без очередей' },
                            { title: 'Электронные билеты', description: 'Получите цифровой билет сразу после оплаты' },
                        ].map((feature, index) => (
                            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }} viewport={{ once: true }} className="features__card">
                                <h3 className="features__card-title">{feature.title}</h3>
                                <p className="features__card-text">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta">
                {!isAuthenticated ? (
                    <>
                        <h2 className="cta__title">Готовы к просмотру?</h2>
                        <p className="cta__text">Создайте аккаунт и начните бронировать прямо сейчас</p>
                        <Link href="/register"><Button size="lg">Зарегистрироваться</Button></Link>
                    </>
                ) : (
                    <>
                        <h2 className="cta__title">Добро пожаловать!</h2>
                        <p className="cta__text">Начните бронировать фильмы прямо сейчас</p>
                        <button onClick={() => router.push('/movies')} className="hero__btn hero__btn--primary">Смотреть фильмы</button>
                    </>
                )}
            </section>
        </div>
    );
}
