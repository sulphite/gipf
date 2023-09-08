const express = require("express");
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
// const io = new Server(httpServer);

// App logic here
console.log("listening on port 3000")
httpServer.listen(3000);
