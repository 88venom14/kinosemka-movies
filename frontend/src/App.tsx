import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Movies from './pages/Movies';
import BookMovie from './pages/BookMovie';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ScrollToTop } from './components/common/ScrollToTop';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/book/:movieId" element={<BookMovie />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-cs-text-secondary mb-4">Страница не найдена (404)</p>
                                <a href="/" className="px-6 py-3 bg-white text-cs-black hover:bg-gray-200 transition-colors">
                                    На главную
                                </a>
                            </div>
                        </div>
                    } />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
