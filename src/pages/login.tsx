'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Input } from '@/components/Input';
import Button from '@/components/Button';
import { useAuthStore } from '@/stores/authStore';

export default function Login() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Ошибка входа');
            setAuth(json.data.token, json.data.user);
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Head><title>КиноСемка — Вход</title></Head>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="auth-page__card">
                <h1 className="auth-page__title">Вход</h1>
                <p className="auth-page__subtitle">Войдите для продолжения</p>
                <form onSubmit={handleSubmit} className="auth-page__form">
                    <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
                    <Input label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                    {error && <p className="auth-page__error">{error}</p>}
                    <Button type="submit" fullWidth loading={loading}>Войти</Button>
                </form>
                <p className="auth-page__footer">Нет аккаунта? <Link href="/register" className="auth-page__footer-link">Зарегистрироваться</Link></p>
            </motion.div>
        </div>
    );
}
