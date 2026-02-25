/**
 * Client Rate Limit configs
 */
export interface Client {
    clientId: string;
    limitPerMinute: number;
}

/**
 * Save and find the Rate limit configs for the client
 */

export interface IClientRepository {
    create(client: Client): Promise<void>;
    findById(clientId: string): Promise<Client | null>
}