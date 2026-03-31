import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Footer: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <footer className="border-t border-cs-border bg-cs-dark py-8 mt-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Киносемка</h3>
                        <p className="text-cs-text-secondary text-sm">
                            Премиальный опыт просмотра кино с хирургической точностью и вниманием к деталям.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Фильмы</h4>
                        <ul className="space-y-2 text-cs-text-secondary text-sm">
                            <li><Link to="/movies" className="hover:text-cs-accent transition-colors">Сейчас в кино</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Аккаунт</h4>
                        <ul className="space-y-2 text-cs-text-secondary text-sm">
                            {isAuthenticated ? (
                                <>
                                    <li><Link to="/dashboard" className="hover:text-cs-accent transition-colors">Мои бронирования</Link></li>
                                    <li><Link to="/dashboard" className="hover:text-cs-accent transition-colors">Управление аккаунтом</Link></li>
                                    <li><button onClick={logout} className="hover:text-cs-accent transition-colors text-left bg-transparent p-0 border-0">Выйти</button></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login" className="hover:text-cs-accent transition-colors">Войти</Link></li>
                                    <li><Link to="/register" className="hover:text-cs-accent transition-colors">Регистрация</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-cs-border mt-8 pt-8 text-center text-cs-text-secondary text-sm">
                    <p>&copy; {new Date().getFullYear()} Киносемка. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;