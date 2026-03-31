import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <section className="relative h-[70vh] md:h-[95vh] flex items-center justify-center border-b border-cs-border">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl lg:text-7xl font-light text-white mb-4 md:mb-6 tracking-wide"
          >
            Добро пожаловать в Киношку
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-cs-text-secondary mb-6 md:mb-8 max-w-2xl mx-auto"
          >
            Премиальный опыт бронирования кинобилетов. Выберите свой идеальный сеанс.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
          >
            <Link
              to="/movies"
              className="text-base md:text-2xl px-8 md:px-16 py-4 md:py-7 bg-white text-cs-black font-medium hover:bg-cs-accent transition-colors"
            >
              Смотреть фильмы
            </Link>
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="text-base md:text-2xl px-8 md:px-16 py-4 md:py-7 bg-transparent text-white border border-cs-border font-medium hover:border-white transition-colors"
              >
                Войти
              </Link>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="text-base px-8 md:px-12 py-4 md:py-7 bg-transparent text-white border border-cs-border font-medium hover:border-white transition-colors"
              >
                Личный кабинет
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 border-b border-cs-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                title: 'Премиум места',
                description: 'Выбирайте между стандартными и VIP местами с повышенным комфортом',
              },
              {
                title: 'Мгновенное бронирование',
                description: 'Забронируйте билеты за несколько кликов без очередей',
              },
              {
                title: 'Электронные билеты',
                description: 'Получите цифровой билет сразу после оплаты',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border border-cs-border bg-cs-dark"
              >
                <h3 className="text-lg text-white mb-3">{feature.title}</h3>
                <p className="text-cs-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 text-center border-b border-cs-border">
        {!isAuthenticated ? (
          <>
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4">Готовы к просмотру?</h2>
            <p className="text-cs-text-secondary mb-6 md:mb-8">Создайте аккаунт и начните бронировать прямо сейчас</p>
            <Link to="/register">
              <Button size="lg">Зарегистрироваться</Button>
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4">Добро пожаловать!</h2>
            <p className="text-cs-text-secondary mb-6 md:mb-8">Начните бронировать фильмы прямо сейчас</p>
            <button
              onClick={() => navigate('/movies')}
              className="text-base px-8 md:px-12 py-4 md:py-7 bg-white text-cs-black font-medium hover:bg-cs-accent transition-colors"
            >
              Смотреть фильмы
            </button>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
