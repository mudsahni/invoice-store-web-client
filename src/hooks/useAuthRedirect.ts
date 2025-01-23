import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthRedirect(redirectUrl = '/login') {
    const { authUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !authUser) {
            router.push(redirectUrl);
        }
    }, [authUser, loading, router, redirectUrl]);

    return { authUser, loading };
}
