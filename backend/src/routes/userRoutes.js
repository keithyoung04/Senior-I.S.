const express = require("express");
const jwt = require("jsonwebtoken");
//import express from "express";
//import { getAllUsersService, getUserByIDService } from "../models/userModels.js";
//const { getAllUsersService, getUserByIDService, loginUserService } = require("../models/userModels.js");
const {getAllUsers, getAllPoints, createPoints, loginUser, createUser, createRefreshToken} = require("../controllers/userController.js")
const {sendData} = require("../controllers/socketController.js");
//const { fakeFunction } = require("../config/index.js");
const router = express.Router();

/*  On the frontend send request to get user by ID and then store the ID bewteen pages once it is verified
- authenticates token on every request from the client to the server as middleware
- checks id sent in the payload to verified the request is authenticated and varified to perform task on the route

*/
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log("authHeader variable: ", authHeader)
    console.log("logging headers: ", req.headers)
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token in jwt.verify: ", token)
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, id) => {
        console.log("payload from jwt.verify: ", id)
        console.log("req.params.id: ", req.params.id)
        if (err) return res.sendStatus(403);
        const idCheck = req.params.id;
        //console.log(idCheck)
        const numIdCheck = Number(idCheck)
        //console.log("parse req.params.id and get number check: ", numIdcheck);
        if(numIdCheck !== id.id.id){
            console.log("unauthorized ID")
            console.log("idCheck: ", numIdCheck)
            console.log("id.id.id: ", id.id.id)
            return res.sendStatus(401)
        }
        //console.log("req.params", req.params)
        req.id = id.id.id
        console.log("typeof numIdCheck: ", typeof(numIdCheck))
        console.log("req.id: ", req.id)
        console.log("id from jwt.verify: ", id)
        next();
        
    })
}

router.post("/login", loginUser)
router.get("/points/:id", authenticateToken, getAllPoints);
router.post("/register", createUser);
router.post("/users", createPoints)



//router.post("/token", );
//router.post("/token", createRefreshToken);
//router.get("/users", getAllUsers);
module.exports = router