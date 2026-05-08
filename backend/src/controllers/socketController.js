//const { Socket } = require("socket.io");

const {getAllPointsService} = require('../models/userModels.js');


   
module.exports = (io, socket) => {
    const sendData = async () => {
try {
    const response = await getAllPointsService();
    const socketemitter = await socket.emitWithAck("hello", response);
    console.log(socketemitter.status);
    
} catch (error) {
    console.log(error);
} 
   }
    sendData();

}
    