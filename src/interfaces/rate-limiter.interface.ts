export interface RateLimiter {
    allowed: boolean;
}

export interface IRateLimiter {
    // to check is client allowed to make api requests
    isAllowed(clientId: string): RateLimiter
}

export interface UsageStats {
    currentWindow: number;
    previousWindow: number;
}

export interface IRateLimiterRepository {
    getSlidingWindowCounter(clientId: string, currentWindow: string, previousWindow: string): Promise<UsageStats>;
    updateWindow(clientId: string, windowKey: string): Promise<void>;
}