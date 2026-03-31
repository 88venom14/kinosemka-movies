import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
    const user = useAuthStore(state => state.user);
    const token = useAuthStore(state => state.token);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const isLoading = useAuthStore(state => state.isLoading);
    const login = useAuthStore(state => state.login);
    const register = useAuthStore(state => state.register);
    const logout = useAuthStore(state => state.logout);
    const checkAuth = useAuthStore(state => state.checkAuth);

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
    };
};
