import { create } from 'zustand';

interface AuthState {
    token: string | null;
    user: { _id: string; name: string; email: string; createdAt: string } | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setAuth: (token: string, user: { _id: string; name: string; email: string; createdAt: string }) => void;
    logout: () => void;
    loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isLoading: true,
    isAuthenticated: false,
    setAuth: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user, isAuthenticated: true, isLoading: false });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    },
    loadFromStorage: () => {
        const token = localStorage.getItem('token');
        if (token) {
            set({ token, isAuthenticated: true, isLoading: true });
            fetch('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
                .then(r => r.json())
                .then(json => {
                    if (json.data?.user) set({ user: json.data.user, isLoading: false });
                    else { localStorage.removeItem('token'); set({ token: null, user: null, isAuthenticated: false, isLoading: false }); }
                })
                .catch(() => { localStorage.removeItem('token'); set({ token: null, user: null, isAuthenticated: false, isLoading: false }); });
        }
        else set({ isLoading: false });
    },
}));
