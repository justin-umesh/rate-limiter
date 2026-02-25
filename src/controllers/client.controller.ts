import { Request, Response } from "express";
import { ClientService } from "../services/client.service";
import { z } from "zod";

// Validate the request.body for registering the client
const RegisterSchema = z.object({
    clientId: z.string().min(1, "ClientId is required"),
    limitPerMinute: z.number().positive("LimitPerMinute to be a positive integer")
});

// Validate clientID in req.params
const ClientIdParamSchema = z.object({
    clientId: z.string().min(3)
});

export class ClientController {
    // Inject the client service here
    constructor(private clientService: ClientService) {}

    /**
     * @publicAPI
     * POST /clients
     * Body: {"clientId": "user1", "limitPerMinute": 10}
     */

    public registerClient = async (req: Request, res: Response) => {
        try {
            // Validate request body
            const result = RegisterSchema.safeParse(req.body);

            if(!result.success) {
                return res.status(400).json({
                    error: "Invalid input data",
                    message: result.error.format()
                })
            }

            // If no error deletegate to service
            await this.clientService.create(result.data);

            // Return the success response
            return res.status(201).json({
                message: `Client ${result.data.clientId} registered successfully.`,
                limit: result.data.limitPerMinute
            })

        } catch(error) {
            console.error(`[ClientController] Error:, ${error}`);
            return res.status(500).json({"error": "Internal Server Error"})
        }
    }

    /**
     * Get /clients/:clientId
     */

    public getClient = async(req: Request, res: Response) => {
        try {
            // Validate the client ID
            const checkClientId = ClientIdParamSchema.safeParse(req.params);

            // If validation failed
            if(!checkClientId.success) {
                return res.status(400).json({
                    error: "Invalid clientId", message: checkClientId.error.format()
                });
            }

            // Delegate to fetching the client
            const client = await this.clientService.findById(checkClientId.data.clientId);

            // if not client found then return the error
            if (!client) {
                return res.status(404).json({ error: "Client not found" });
            }

            // Success response
            return res.status(200).json(client)

        } catch(error) {
            return res.status(500).json({error: "Internal Server Error"})
        }

    }

}