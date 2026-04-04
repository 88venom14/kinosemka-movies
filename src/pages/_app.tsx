import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import Layout from '@/components/Layout';
import '@/styles/variables.css';
import '@/styles/layout.css';
import '@/styles/components.css';
import '@/styles/seat-selector.css';
import '@/styles/home.css';
import '@/styles/movies.css';
import '@/styles/booking.css';
import '@/styles/auth.css';
import '@/styles/dashboard.css';

export default function App({ Component, pageProps }: AppProps) {
    const { loadFromStorage } = useAuthStore();
    useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
