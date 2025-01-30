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


    async stream<T>(endpoint: string, onEvent: (event: T) => void): Promise<() => void> {
        const controller = new AbortController();

        const fetchAndStream = async () => {
            try {
                console.log(`${new Date().toISOString()} Starting stream request to ${endpoint}`);
                const headers = await this.getHeaders();

                const response = await fetch(`${this.getBaseUrl()}${endpoint}`, {
                    headers: {
                        ...headers,
                        'Accept': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive'
                    },
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body!.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                const processBuffer = () => {
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer

                    let currentEvent: { id?: string; event?: string; data?: string } = {};

                    for (const line of lines) {
                        console.log('Processing line:', line); // Debug log

                        if (line.startsWith('id:')) {
                            currentEvent.id = line.slice(3).trim();
                        } else if (line.startsWith('event:')) {
                            currentEvent.event = line.slice(6).trim();
                        } else if (line.startsWith('data:')) {
                            currentEvent.data = line.slice(5).trim();

                            // If we have data, try to process the complete event
                            if (currentEvent.data) {
                                try {
                                    console.log('Parsing data:', currentEvent.data);
                                    const data = JSON.parse(currentEvent.data);
                                    console.log('Parsed event:', {
                                        id: currentEvent.id,
                                        event: currentEvent.event,
                                        data
                                    });
                                    onEvent(data);
                                } catch (e) {
                                    console.error('Error parsing event data:', e);
                                }
                                // Reset for next event
                                currentEvent = {};
                            }
                        }
                    }
                };

                (async () => {
                    try {
                        while (true) {
                            const {done, value} = await reader.read();
                            if (done) break;

                            buffer += decoder.decode(value, {stream: true});
                            processBuffer();
                        }
                    } catch (error) {
                        if (error instanceof Error && error.name !== 'AbortError') {
                            console.error('Stream reading error:', error);
                        }
                    }
                })();

            } catch (error) {
                console.error('Stream setup error:', error);
            }
        };

        // Start the stream processing in the background
        fetchAndStream().catch(error => {
            console.error('Stream initialization error:', error);
        });

        // Return the cleanup function immediately
        return () => {
            controller.abort();
        };
    }
}

