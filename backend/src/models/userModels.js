

const { pool } = require ("../models/db.js");

const getAllUsersService = async () => {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
};

const getUserByIDService = async (email) => {
    const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    return result.rows[0];
};

const confirmEmailService = async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
}

const confirmPasswordService = async (email) => {
    const result = await pool.query("SELECT password FROM users WHERE email= $1", [email])
    return result.rows[0];
}

const loginUserService = async (email, password) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password])
    return result.rows[0];
}

const getAllPointsService = async () => {
    const result = await pool.query("SELECT id, level, latitude, longitude, description FROM pinpoint")
    return result.rows;
}

const createPointService = async (level, users_id, latitude, longitude, description) => {
    const result = await pool.query(
        "INSERT into pinpoint(level, users_id, latitude, longitude, description) VALUES ($1, $2, $3, $4, $5)",
        [level, users_id, latitude, longitude, description]
    );
    return result.rows[0];
}

const createUserService = async (id, email) => {
    const result = await pool.query("INSERT INTO users (id, email) VALUES ($1, $2) RETURNING *",
    [id, email]
);
return result.rows[0];
}





module.exports = {
    getAllUsersService,
    getUserByIDService,
    getAllPointsService,
    createPointService,
    createUserService,
    loginUserService,
    confirmEmailService,
    confirmPasswordService,
}; 

//export default getUserByIDService;

