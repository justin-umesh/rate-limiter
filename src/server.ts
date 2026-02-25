import { ClientRepository } from "./repositories/client.repository";
import { json } from "body-parser";
import express, { Request, Response, Router } from "express";
import { ClientService } from "./services/client.service";
import { ClientController } from "./controllers/client.controller";

// Init the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// use body-parser middleware to parse incoming request bodies in a middleware
app.use(json());


/**
 * Import all the repos and Controllers
 */
const clientsRepo = new ClientRepository();
const clientService = new ClientService(clientsRepo);
const clientController = new ClientController(clientService);

// Base Path set
const rootRouter: Router = Router();
app.use('/v1/api', rootRouter);

// Client Routes
const clientRouter: Router = Router();
rootRouter.use('/clients', clientRouter);
clientRouter.post('/', (req: Request, res: Response) => clientController.registerClient(req, res))

// Start the server
app.listen(PORT, ()=> {
    console.log(`Server is running... at port ${PORT}`);
})