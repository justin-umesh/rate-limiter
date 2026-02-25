import { json } from "body-parser";
import express from "express";

// Init the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// use body-parser middleware to parse incoming request bodies in a middleware
app.use(json());

// Start the server
app.listen(PORT, ()=> {
    console.log(`Server is running... at port ${PORT}`);
})