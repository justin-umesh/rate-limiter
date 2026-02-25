import { IRateLimiterRepository, UsageStats } from "src/interfaces/rate-limiter.interface";

export class RateLimiterRepository implements IRateLimiterRepository {
    // This can be swapped with Redis or any in-memory DB
    private rateLimiterStore = new Map<string, Map<string, number>>();

    async getSlidingWindowCounter(clientId: string, currentWindow_key: string, previousWindow_key: string): Promise<UsageStats> {
        const clientData = this.rateLimiterStore.get(clientId) || new Map();
        return {
            currentWindow: clientData.get(currentWindow_key) || 0,
            previousWindow: clientData.get(previousWindow_key) || 0
        }
    }

    async updateWindow(clientId: string, currentWindowKey: string): Promise<void> {
        if(!this.rateLimiterStore.has(clientId)) this.rateLimiterStore.set(clientId, new Map());
        const clientData = this.rateLimiterStore.get(clientId)!;
        clientData.set(currentWindowKey, (clientData.get(currentWindowKey) || 0) + 1);

        // manual cleanup to prevent memory leak
        this.cleanUp(clientData, currentWindowKey);
    }

    private cleanUp(clientData: Map<string, number>, currentWindowKey: string) {
        // Keep only the last 2 minuts data
        for(const key of clientData.keys()) {
            if(key < currentWindowKey && clientData.size > 5) {
                clientData.delete(key)
            }
        }
    }
}