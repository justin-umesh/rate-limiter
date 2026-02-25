import { ClientRepository } from "./repositories/client.repository";
import { json } from "body-parser";
import express, { Request, Response, Router } from "express";
import { ClientService } from "./services/client.service";
import { ClientController } from "./controllers/client.controller";
import { rateLimiterMiddleware } from "./middlewares/rate-limiter.middleware";
import { RateLimiterService } from "./services/rate-limiter.service";
import { RateLimiterRepository } from "./repositories/rate-limiter.repository";
import { AllowController } from "./controllers/allow.controller";

// Init the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// use body-parser middleware to parse incoming request bodies in a middleware
app.use(json());


/**
 * Import all the repos and Controllers
 */
const clientsRepo = new ClientRepository();
const rateLimitRepo = new RateLimiterRepository();

// Services
const clientService = new ClientService(clientsRepo);
const rateLimitService = new RateLimiterService(clientsRepo, rateLimitRepo);

// Controllers
const clientController = new ClientController(clientService);
const allowController = new AllowController();

// Base Path set
const rootRouter: Router = Router();
app.use('/v1/api', rootRouter);

// Clients Routes
const clientRouter: Router = Router();
rootRouter.use('/clients', clientRouter);
clientRouter.post('/', (req: Request, res: Response) => clientController.registerClient(req, res))

// Allow Routes
const allowRouter: Router = Router();
rootRouter.use('/allow', allowRouter);

// Use middleware 
const rateLimiter = rateLimiterMiddleware(rateLimitService);

allowRouter.get('/:clientId', rateLimiter, (req: Request, res: Response) => allowController.getByClientId(req, res))


// Start the server
app.listen(PORT, ()=> {
    console.log(`Server is running... at port ${PORT}`);
})