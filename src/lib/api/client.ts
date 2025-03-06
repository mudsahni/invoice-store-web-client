import {auth} from '@/lib/firebase';
import {Tenant} from "@/types/auth";

interface ApiClientOptions {
    baseUrlPrefix: string;
    baseUrlSuffix?: string;
    defaultTimeout?: number;
}

interface RequestOptions {
    timeout?: number;
    retryCount?: number;
    retryDelay?: number;
    headers?: Record<string, string>;
}


interface ApiError extends Error {
    status?: number;
    data?: any;
}

export class ApiClient {
    private readonly baseUrlPrefix: string;
    private readonly baseUrlSuffix?: string;
    private readonly defaultTimeout: number;

    constructor(options: ApiClientOptions) {
        this.baseUrlPrefix = options.baseUrlPrefix;
        this.baseUrlSuffix = options.baseUrlSuffix;
        this.defaultTimeout = options.defaultTimeout || 30000; // Default 30s timeout (increased from 10s)
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


    private async getHeaders(customHeaders?: Record<string, string>): Promise<HeadersInit> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...customHeaders
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
        options: RequestInit & { timeout?: number }
    ): Promise<Response> {
        const timeout = options.timeout || this.defaultTimeout;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort(`Request timed out after ${timeout}ms`);
        }, timeout);

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

    // Retry logic for failed requests
    private async withRetry<T>(
        operation: () => Promise<T>,
        options: { retryCount?: number; retryDelay?: number } = {}
    ): Promise<T> {
        const maxRetries = options.retryCount || 0;
        const delay = options.retryDelay || 1000;

        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));

                // Don't retry if we've reached max retries
                if (attempt >= maxRetries) {
                    break;
                }

                // Don't retry if the request was aborted
                if (error instanceof DOMException && error.name === 'AbortError') {
                    break;
                }

                console.warn(`Request failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms`, error);

                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
            }
        }

        throw lastError || new Error('Request failed after retries');
    }

    async get<T>(endpoint: string, params?: Record<string, string>, options: RequestOptions = {}): Promise<T> {
        return this.withRetry(async () => {
            const url = new URL(`${this.getBaseUrl()}${endpoint}`);
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    url.searchParams.append(key, value);
                });
            }

            const response = await this.fetchWithTimeout(url.toString(), {
                method: 'GET',
                headers: await this.getHeaders(options.headers),
                timeout: options.timeout
            });

            return this.handleResponse<T>(response);
        }, {retryCount: options.retryCount, retryDelay: options.retryDelay});
    }

    async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
        return this.withRetry(async () => {
            try {
                console.log(`POST request to ${endpoint} with timeout ${options.timeout || this.defaultTimeout}ms`);

                const response = await this.fetchWithTimeout(
                    `${this.getBaseUrl()}${endpoint}`,
                    {
                        method: 'POST',
                        headers: await this.getHeaders(options.headers),
                        body: data ? JSON.stringify(data) : undefined,
                        timeout: options.timeout
                    }
                );

                console.log('Response status:', response.status);

                return this.handleResponse<T>(response);
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        }, {retryCount: options.retryCount, retryDelay: options.retryDelay});
    }

    async put<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
        return this.withRetry(async () => {
            const response = await this.fetchWithTimeout(
                `${this.getBaseUrl()}${endpoint}`,
                {
                    method: 'PUT',
                    headers: await this.getHeaders(options.headers),
                    body: data ? JSON.stringify(data) : undefined,
                    timeout: options.timeout
                }
            );

            return this.handleResponse<T>(response);
        }, {retryCount: options.retryCount, retryDelay: options.retryDelay});
    }


    async patch<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
        return this.withRetry(async () => {
            const response = await this.fetchWithTimeout(
                `${this.getBaseUrl()}${endpoint}`,
                {
                    method: 'PATCH',
                    headers: await this.getHeaders(options.headers),
                    body: data ? JSON.stringify(data) : undefined,
                    timeout: options.timeout
                }
            );

            return this.handleResponse<T>(response);
        }, {retryCount: options.retryCount, retryDelay: options.retryDelay});
    }

    async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        return this.withRetry(async () => {
            const response = await this.fetchWithTimeout(
                `${this.getBaseUrl()}${endpoint}`,
                {
                    method: 'DELETE',
                    headers: await this.getHeaders(options.headers),
                    timeout: options.timeout
                }
            );

            return this.handleResponse<T>(response);
        }, {retryCount: options.retryCount, retryDelay: options.retryDelay});
    }


    async stream<T>(endpoint: string, onEvent: (event: T) => void, options: RequestOptions = {}): Promise<() => void> {
        const controller = new AbortController();

        const fetchAndStream = async () => {
            try {
                console.log(`${new Date().toISOString()} Starting stream request to ${endpoint}`);
                const headers = await this.getHeaders(options.headers);

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
                        if (line.trim() === '') continue; // Skip empty lines

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

                await (async () => {
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

    async getBlob(endpoint: string, options: RequestOptions = {}): Promise<Blob> {
        return this.withRetry(async () => {
            const url = new URL(`${this.getBaseUrl()}${endpoint}`);

            const response = await this.fetchWithTimeout(url.toString(), {
                method: 'GET',
                headers: {
                    ...await this.getHeaders(options.headers),
                    'Accept': 'text/csv'  // Request CSV
                },
                timeout: options.timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.blob();  // Return as blob directly
        }, {retryCount: options.retryCount, retryDelay: options.retryDelay});
    }

}

