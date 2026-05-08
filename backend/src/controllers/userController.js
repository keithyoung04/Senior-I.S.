const { createUserService, getAllUsersService, getAllPointsService, createPointService, loginUserService, confirmEmailService, confirmPasswordService, getUserByIDService } = require("../models/userModels.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config();


const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });  
};


//Creates a user in the database
const createUser = async (req, res, next) => {
    const {email, password } = req.body;
    const hashSaltpassword = await bcrypt(password, 10); 

    try {
        const newUser = await createUserService(email, hashSaltpassword)
        handleResponse(res, 201, "User Created Successfully", newUser)
    } catch (err) {
        next(err);  
    }
};

const loginUser = async (req, res, next) => {
    
        const email = req.body.email;
        //console.log(`Email from response body: ${email}`)
        const password = req.body.password;
        //console.log(`Password from response body: ${password}`)
        // check hashed password
        /* confirm email first, if email is valid then check password input from client with database encrypted password with bcrypt
        */
       try{
            validEmail = await confirmEmailService(email)
    
            if(!validEmail){
                res.send("email not found")
                return
            }
            const emailPassword = await confirmPasswordService(email)
            //console.log("emailPassword: ", emailPassword)
            const validPassword = await bcrypt.compare(password,String(emailPassword.password))
            //console.log("validpassword function: ", validPassword)
            if (!validPassword){
                res.send("wrong password")
                return
            }
            const id = await getUserByIDService(email)
            req.params.id = id
            console.log("req.params.id: ", req.params.id)
            const accessToken = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
            const refreshToken = jwt.sign(id, process.env.REFRESH_TOKEN_SECRET)
            console.log("What is in access token: ", id)
            console.log('token value: ', accessToken);
            res.json({ accessToken : accessToken})
            
        } catch (error) {
            next(error);
        }
       
    }

/*const createToken = async () => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    //if(!refreshToken) return res.sendStatus(403) check refresh token in client

}
*/



//Gets all users in the database
const getAllUsers = async (req, res, next) => { 
    try {
        const user = await getAllUsersService();
         handleResponse(res, 200, "Users fetched Successfully", user)
    } catch (err) {
        next(err);   
    }
};
//Receives all points from the database
const getAllPoints = async (req, res, next) => {
    try {
        const points = await getAllPointsService();
        handleResponse(res, 200, "Points fetched successfully", points)
    } catch (error) {
        next(error);
    }
}; 


// pass in users_id for the addPoints query parameter
const createPoints = async (req, res, next) => {
    try {
        //const users_id = req.params.users_id
        const {level, users_id, latitude, longitude, description} = req.body
        const point = await createPointService(level, users_id, latitude, longitude, description)
        handleResponse(res, 201, "Points created successfully", point)

    } catch (err) {
        next(err);
    }
};


module.exports = {
    handleResponse,
    getAllUsers,
    createUser,
    getAllPoints,
    createPoints,
    loginUser
}
