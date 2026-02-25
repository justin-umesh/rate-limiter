import { IClientRepository, Client } from "@interfaces";

export class ClientRepository implements IClientRepository {

    // This can be swapped with Prisma or TypeORM 
    private clientsStore = new Map<string, Client>();

    // Register the clients with clientID and LimitPerMinute
    async create(client: Client): Promise<void> {
        this.clientsStore.set(client.clientId, client);
    }

    // Get the client rate limit configs by client ID
    async findById(clientId: string): Promise<Client | null> {
        return this.clientsStore.get(clientId) || null
    }
}
