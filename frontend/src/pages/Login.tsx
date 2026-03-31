import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Ошибка входа. Проверьте данные.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="border border-cs-border p-8 bg-cs-dark">
                    <h1 className="text-2xl font-light text-white mb-2 text-center">Вход</h1>
                    <p className="text-cs-text-secondary text-center mb-8">
                        Войдите для продолжения
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />

                        <Input
                            label="Пароль"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        <Button type="submit" fullWidth loading={loading}>
                            Войти
                        </Button>
                    </form>

                    <p className="text-center text-cs-text-secondary text-sm mt-6">
                        Нет аккаунта?{' '}
                        <Link to="/register" className="text-white hover:underline">
                            Зарегистрироваться
                        </Link>
                    </p>

                    {import.meta.env.DEV && (
                        <div className="mt-6 p-4 border border-cs-border bg-cs-black text-xs text-cs-text-secondary">
                            <p className="text-white font-medium mb-2">Тестовые аккаунты:</p>
                            <p>admin@cineselect.com / admin123</p>
                            <p>user@cineselect.com / user123</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
