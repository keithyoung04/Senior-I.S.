//const express = require("express");


const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: 500,
        message: "Something went wrong",
        error: err.message,
    });
};

module.exports = errorHandler