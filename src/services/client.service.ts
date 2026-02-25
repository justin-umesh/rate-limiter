import { Client, IClientRepository } from "@interfaces";

export class ClientService implements IClientRepository {
    
    // Dependency injection
    constructor(private clientRepo: IClientRepository) {}

    // Create or update the client's rate limit configuration in the DB
    public async create(client: Client): Promise<void> {
        await this.clientRepo.create(client);
    }

    // Get the rate limit configs for the client by id
    public async findById(clientId: string): Promise<Client | null> {
        const client = await this.clientRepo.findById(clientId);

        // If client doesn't exist, we will just log the warning message
        if(!client) {
            console.warn(`[ClientService] Client ${clientId} not found.`)
        }

        return client;
    }
}