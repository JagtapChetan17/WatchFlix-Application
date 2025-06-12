require('dotenv').config();
const httpServer = require('http-server');
const path = require('path');

const directoryPath = ''; // SET YOUR PATH OF HTTP SERVER HERE 
const absolutePath = path.resolve(directoryPath);
console.log(`Serving files from: ${absolutePath}`);

const server = httpServer.createServer({
    root: absolutePath,
    cache: -1, 
    username: process.env.HTTP_SERVER_USERNAME,
    password: process.env.HTTP_SERVER_PASSWORD,
});

server.listen(8080, () => {
    console.log(`Server running at http://localhost:8080/`);
});
