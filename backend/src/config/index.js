const express = require("express");
const app = express();
const http = require('http');
const jwt = require('jsonwebtoken');

const dotenv = require("dotenv");
const { Server } = require("socket.io");
//come back and change cors origin when not testing
const cors = require("cors");
app.use(cors());
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin:'*'
    }
});


const userRoute = require("../routes/userRoutes.js");
dotenv.config();


const errorHandling = require("../middleware/errorHandler.js");



/*io.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});*/
// middleware
app.use(express.urlencoded({extended : true}))
app.use(express.json());
app.use(errorHandling);
app.use("/", userRoute);

/*io.on("connection", (socket) => {
    socket.emit('id', socket.id);
});*/

const PORT = process.env.PORT || 3001;
const registerSocket = require('../controllers/socketController.js');
const onConnection = (socket) => {
    registerSocket(io, socket);
}
io.on("connection", onConnection);






const fakeFunction = async (req, res, next) => {
    req.id = await foo
    next()
} 



server.listen(PORT, async () => {
    console.log(`Server listening on port: ${PORT}`);
    /*console.log(`Server listening on ${PORT}`);
    try {
         ngrokUrl = await ngrok.connect({addr: PORT})
         console.log(`ngrok tunnel in: ${ngrokUrl}`);
         console.log("tunnel successfully connected")
        
    } catch (error) {
        console.log(`Couldn't tunnel ngrok: ${error}`)
    }
    */
});


module.exports = {
    //authenticateToken,
    fakeFunction
};