// services/tenantService.ts
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

interface Tenant {
    id: string;
    name: string;
    domain: string;
}

export const tenantService = {
    async getTenants(): Promise<Tenant[]> {
        const tenantsRef = collection(db, 'tenants');
        const snapshot = await getDocs(tenantsRef);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Tenant));
    },

    async signInWithTenant(email: string, password: string, tenantId: string) {
        try {
            // First verify the tenant exists
            const tenantRef = doc(db, 'tenants', tenantId);
            const tenantDoc = await getDoc(tenantRef);

            if (!tenantDoc.exists()) {
                throw new Error('Invalid tenant');
            }

            // Sign in the user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Verify user belongs to tenant by checking users collection
            const userRef = doc(db, 'users', userCredential.user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists() || userDoc.data().tenantId !== tenantId) {
                // If user doesn't belong to tenant, sign them out and throw error
                await auth.signOut();
                throw new Error('User does not belong to this organization');
            }

            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }
};