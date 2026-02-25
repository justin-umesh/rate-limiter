import { Request, Response } from "express";
import { z } from 'zod';

// Define a schema that matches your interface
const ClientSchema = z.object({
    clientId: z.string().min(1),
});

export class AllowController {

    /**
     * POST /clients
     * Registers a new client and their limit.
     */

    public getByClientId = async (req: Request, res: Response) => {

        const result = ClientSchema.safeParse(req.params);

        if(!result.success) {
            return res.status(400).json({"error": result.error.format()})
        }

        res.status(200).json({"allowed": true})
    }
}