'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Input } from '@/components/Input';
import Button from '@/components/Button';
import { useAuthStore } from '@/stores/authStore';

export default function Register() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) { setError('Пароли не совпадают'); return; }
        if (password.length < 6) { setError('Пароль должен быть не менее 6 символов'); return; }
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Ошибка регистрации');
            setAuth(json.data.token, json.data.user);
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Ошибка регистрации');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-page">
            <Head><title>КиноСемка — Регистрация</title></Head>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="auth-page__card">
                <h1 className="auth-page__title">Регистрация</h1>
                <p className="auth-page__subtitle">Создайте аккаунт для бронирования</p>
                <form onSubmit={handleSubmit} className="auth-page__form auth-page__form--compact">
                    <Input label="Имя" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван Иванов" required />
                    <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
                    <Input label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                    <Input label="Подтвердите пароль" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
                    {error && <p className="auth-page__error">{error}</p>}
                    <Button type="submit" fullWidth loading={loading}>Зарегистрироваться</Button>
                </form>
                <p className="auth-page__footer">Уже есть аккаунт? <Link href="/login" className="auth-page__footer-link">Войти</Link></p>
            </motion.div>
        </div>
    );
}
