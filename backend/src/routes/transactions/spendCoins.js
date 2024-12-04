const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../../models/User')




dotenv.config();

const spendUserCoins = async(req, res) =>{


    console.log("we hitting the SPEND ENDPOINT:", req.body);

    res.json({
        ass: "eaterrrrrrrrrrrrrrrrrrrr"
    })



}

module.exports = {spendUserCoins};