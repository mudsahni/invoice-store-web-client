// Generic cache types
interface CacheConfig<T> {
    prefix: string;
    ttl: number;  // Time to live in milliseconds
    validator?: (data: T) => boolean;  // Optional custom validation function
}

interface CacheData<T> {
    timestamp: number;
    data: T;
}

// Generic cache manager class
export class CacheManager<T> {
    private prefix: string;
    private ttl: number;
    private validator?: (data: T) => boolean;

    constructor(config: CacheConfig<T>) {
        this.prefix = config.prefix;
        this.ttl = config.ttl;
        this.validator = config.validator;
    }

    private getKey(id: string): string {
        return `${this.prefix}_${id}`;
    }

    public get(id: string): CacheData<T> | null {
        try {
            const cached = localStorage.getItem(this.getKey(id));
            if (!cached) return null;

            const cacheData: CacheData<T> = JSON.parse(cached);

            if (!this.isValid(cacheData)) {
                console.log('Cache has expired or is invalid:', cacheData)
                this.clear(id);
                return null;
            }

            return cacheData;
        } catch (err) {
            console.error('Error reading from cache:', err);
            return null;
        }
    }

    public set(id: string, data: T): void {
        try {
            const cacheData: CacheData<T> = {
                timestamp: Date.now(),
                data: data
            };
            localStorage.setItem(this.getKey(id), JSON.stringify(cacheData));
        } catch (err) {
            console.error('Error writing to cache:', err);
        }
    }

    public clear(id: string): void {
        try {
            localStorage.removeItem(this.getKey(id));
        } catch (err) {
            console.error('Error clearing cache:', err);
        }
    }

    public clearAll(): void {
        try {
            Object.keys(localStorage)
                .filter(key => key.startsWith(this.prefix))
                .forEach(key => localStorage.removeItem(key));
        } catch (err) {
            console.error('Error clearing all cache:', err);
        }
    }

    private isValid(cacheData: CacheData<T>): boolean {
        // Check if cache has expired
        if (Date.now() - cacheData.timestamp >= this.ttl) {
            return false;
        }

        // Run custom validator if provided
        return !(this.validator && !this.validator(cacheData.data));
    }

    public refresh(id: string, fetcher: () => Promise<T>): Promise<T> {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await fetcher();
                this.set(id, data);
                resolve(data);
            } catch (err) {
                reject(err);
            }
        });
    }
}
