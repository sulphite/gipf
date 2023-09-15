import express = require("express");
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

console.log("listening on port 3000");
httpServer.listen(3000);
