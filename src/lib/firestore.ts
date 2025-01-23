//lib/firestore.ts
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { UserData, Tenant } from '@/types/auth';

const db = getFirestore();

const USER_COLLECTION = 'users';
const TENANT_COLLECTION = 'tenants';

export async function fetchUserData(tenantid: string, uid: string): Promise<UserData | null> {
    try {
        console.log('Fetching user data:', tenantid, uid)
        const userDoc = await getDoc(doc(db, TENANT_COLLECTION + '/' + tenantid + '/' + USER_COLLECTION, uid));
        if (!userDoc.exists()) {
            return null;
        }
        return {
            id: userDoc.id,
            ...userDoc.data(),
            createdAt: userDoc.data().createdAt?.toDate(),
            updatedAt: userDoc.data().updatedAt?.toDate()
        } as UserData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

export async function fetchTenantData(tenantId: string): Promise<Tenant | null> {
    try {
        const tenantDoc = await getDoc(doc(db, TENANT_COLLECTION, tenantId));
        if (!tenantDoc.exists()) {
            return null;
        }
        return {
            id: tenantDoc.id,
            ...tenantDoc.data(),
            createdAt: tenantDoc.data().createdAt?.toDate(),
            updatedAt: tenantDoc.data().updatedAt?.toDate()
        } as Tenant;
    } catch (error) {
        console.error('Error fetching tenant data:', error);
        throw error;
    }
}
