// lib/fetcher.ts

export const fetcher = async (input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init);
    if (response.status === 401) {
        // Dispatch a custom unauthorized event
        const event = new Event('unauthorized');
        window.dispatchEvent(event);
        throw new Error('Unauthorized');
    }
    return response.json();
};