const http = require('http');
const app = require('../src/app');



const server = http.createServer(app);

server.listen(process.env.ServerPort, console.log("Server running on port 3000"));




