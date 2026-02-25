import { NextFunction, Request, Response } from "express";
import { RateLimiterService } from "src/services/rate-limiter.service";
import { z } from 'zod';

/**
 * Validate Params
 */
const ParamsSchema = z.object({
    clientId: z.string().min(1)
});

export const rateLimiterMiddleware = (rateLimiterService: RateLimiterService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get client id from the request
            const validation = ParamsSchema.safeParse(req.params);

            if(!validation.success) {
                return res.status(400).json({error: "Invalid ClientId"})
            }

            // Check with service - is it allowed
            const isAllowed = await rateLimiterService.isAllowed(validation.data.clientId);

            if(!isAllowed) {
                console.warn(`[RateLimiterMiddleware] Blocked request for client: ${validation.data.clientId}`);
                return res.status(429).json({
                    allowed: false,
                });
            }

            // Move to next handler
            next()


        } catch(error) {
            console.error('[RateLimiterMiddleware] Error:', error);
            // In case of error, we usually fail "open" or "closed". 
            // Failing "open" (next()) ensures app doesn't break if the limiter has a bug.
            next();
        }
    }
}