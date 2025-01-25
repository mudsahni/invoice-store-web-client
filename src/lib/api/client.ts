import { auth } from '@/lib/firebase';
import {Tenant} from "@/types/auth";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import {CollectionStatusEvent} from "@/types/collections";

interface ApiClientOptions {
    baseUrlPrefix: string;
    baseUrlSuffix?: string;
    timeout?: number;
}

interface ApiError extends Error {
    status?: number;
    data?: any;
}

export class ApiClient {
    private readonly baseUrlPrefix: string;
    private readonly baseUrlSuffix?: string;
    private readonly timeout: number;

    constructor(options: ApiClientOptions) {
        this.baseUrlPrefix = options.baseUrlPrefix;
        this.baseUrlSuffix = options.baseUrlSuffix;
        this.timeout = options.timeout || 10000; // Default 10s timeout
    }


    private getTenantFromStorage(): Tenant | null {
        const savedTenant = localStorage.getItem('tenant');
        if (!savedTenant) return null;

        try {
            return JSON.parse(savedTenant);
        } catch (error) {
            console.error('Error parsing tenant from localStorage:', error);
            return null;
        }
    }

    private getBaseUrl(): string {
        const tenant = this.getTenantFromStorage();
        if (!tenant) {
            throw new Error('No tenant found in storage');
        }

        return `${this.baseUrlPrefix}/tenants/${tenant.id}${this.baseUrlSuffix || ''}`;
    }


    private async getHeaders(): Promise<HeadersInit> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Get fresh token
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken(true);
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    private async fetchWithTimeout(
        url: string,
        options: RequestInit
    ): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            return await fetch(url, {
                ...options,
                credentials: "include",
                signal: controller.signal,
            });
        } finally {
            clearTimeout(timeoutId);
        }
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error: ApiError = new Error('API request failed');
            error.status = response.status;

            try {
                error.data = await response.json();
            } catch {
                error.data = await response.text();
            }

            throw error;
        }

        // Handle empty responses
        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        const url = new URL(`${this.getBaseUrl()}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const response = await this.fetchWithTimeout(url.toString(), {
            method: 'GET',
            headers: await this.getHeaders(),
        });

        return this.handleResponse<T>(response);
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        try {
            const response = await this.fetchWithTimeout(
                `${this.getBaseUrl()}${endpoint}`,
                {
                    method: 'POST',
                    headers: await this.getHeaders(),
                    body: data ? JSON.stringify(data) : undefined,
                }
            );

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            return this.handleResponse<T>(response);
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;

        }
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        const response = await this.fetchWithTimeout(
            `${this.getBaseUrl()}${endpoint}`,
            {
                method: 'PUT',
                headers: await this.getHeaders(),
                body: data ? JSON.stringify(data) : undefined,
            }
        );

        return this.handleResponse<T>(response);
    }

    async patch<T>(endpoint: string, data?: any): Promise<T> {
        const response = await this.fetchWithTimeout(
            `${this.getBaseUrl()}${endpoint}`,
            {
                method: 'PATCH',
                headers: await this.getHeaders(),
                body: data ? JSON.stringify(data) : undefined,
            }
        );

        return this.handleResponse<T>(response);
    }

    async delete<T>(endpoint: string): Promise<T> {
        const response = await this.fetchWithTimeout(
            `${this.getBaseUrl()}${endpoint}`,
            {
                method: 'DELETE',
                headers: await this.getHeaders(),
            }
        );

        return this.handleResponse<T>(response);
    }


    stream<T>(endpoint: string, onEvent: (event: T) => void): () => void {
        const url = new URL(`${this.getBaseUrl()}${endpoint}`);

        const eventSource = new EventSource(url.toString());
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onEvent(data);
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            eventSource.close();
        };

        // Return cleanup function
        return () => {
            eventSource.close();
        };
    }
}

