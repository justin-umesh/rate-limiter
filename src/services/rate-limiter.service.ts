import { IClientRepository } from "@interfaces";
import { IRateLimiterRepository } from "src/interfaces/rate-limiter.interface";

export class RateLimiterService {
    constructor(
        private clientRepo: IClientRepository,
        private rateLimterRepo: IRateLimiterRepository
    ) {}

    public async isAllowed(clientId: string): Promise<boolean> {
        // get the client's api limit
        const client = await this.clientRepo.findById(clientId);

        // if client not found
        if(!client) return false; // block the unknown requests;

        const limit = client.limitPerMinute;

        // current and previous window keys
        const now = new Date();
        const currentWindow_key = this.generateKey(now);
        const previousWindow_key = this.generateKey(new Date(now.getTime() - 60000));
        const { currentWindow, previousWindow } = await this.rateLimterRepo.getSlidingWindowCounter(clientId, currentWindow_key, previousWindow_key);

        // Calculate window weight
        const previousWindowWeight = (60 - now.getUTCSeconds()) / 60;
        const estimatedCount = (previousWindow * previousWindowWeight) + currentWindow;

        if(estimatedCount >= limit) return false;

        // Update the window
        await this.rateLimterRepo.updateWindow(clientId, currentWindow_key);
        return true

    }

    private generateKey(date: Date): string {
        return date.toISOString().replace(/[-T:Z.]/g, '').slice(0, 12);
    }
}