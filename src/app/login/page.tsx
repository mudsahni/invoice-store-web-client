'use client'

import { useState } from 'react';
import { OrganizationSelect } from '@/components/ui/OrganizationSelect';
import { LoginForm } from '@/components/ui/LoginForm';
import {useAuth} from "@/contexts/AuthContext";

export default function LoginPage() {
    const { tenant, signIn, authUser, loading: authLoading } = useAuth();

    const [step, setStep] = useState<'org' | 'login'>('org');

    // If still checking auth state or if user is authenticated, show nothing
    if (authLoading || authUser) {
        return null;
    }

    return (
        <div className="min-h-screen">
            {step === 'org' ? (
                <OrganizationSelect onNext={() => setStep('login')} />
            ) : (
                <LoginForm  />
            )}
        </div>
    );
}
