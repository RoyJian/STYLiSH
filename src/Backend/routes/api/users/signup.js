const express = require('express');
const router = express.Router();
const validator = require('validator');
const multer = require('multer');
const encryption = require('../../../util/encryption');
const db = require('../../../util/database');

router.post('/',multer().none(),async function(req, res, next) {
    const { name,email} = req.body;
    let sql,ressql;
    if (!validator.isEmail(email))
        return res.status(401).send({code: 401,description:"your email not match email format"})
    const password = encryption(req.body.password);

    sql = `INSERT INTO user(email,password,name,token) VALUES (?,?,?,NULL)`;
    db.query({sql:sql,values:[email,password,name]}
    ).then((rows)=>{
        return res.status(200).send({ststus:"success"})}
    ).catch(error =>{
        return res.status(400).send({code:400,description:"This email has been created."})
    });        
        
    
});


module.exports = router;
