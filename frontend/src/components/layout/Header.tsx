import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="border-b border-cs-border bg-cs-dark">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight">
                    Кино<span className="text-cs-accent">Семка</span>
                </Link>

                <nav className="hidden md:block">
                    <ul className="flex space-x-8">
                        <li><Link to="/" className="hover:text-cs-accent transition-colors">Главная</Link></li>
                        <li><Link to="/movies" className="hover:text-cs-accent transition-colors">Фильмы</Link></li>
                        <li><Link to="/dashboard" className="hover:text-cs-accent transition-colors">Аккаунт</Link></li>
                    </ul>
                </nav>

                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="text-sm hover:text-cs-accent transition-colors"
                            >
                                {user?.name || 'Профиль'}
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm text-cs-text-secondary hover:text-cs-text-primary transition-colors"
                            >
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm hover:text-cs-accent transition-colors"
                            >
                                Войти
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm px-4 py-2 bg-white text-cs-black font-medium hover:bg-cs-accent transition-colors"
                            >
                                Регистрация
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;