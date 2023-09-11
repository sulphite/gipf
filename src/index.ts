import express = require("express");
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

// App logic here
console.log("listening on port 3000");
httpServer.listen(3000);
