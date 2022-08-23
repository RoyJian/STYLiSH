const express = require("express");
const router = express.Router();
const validator = require("validator");
const multer = require("multer");
const encryption = require("../../../util/encryption");
const db = require("../../../util/database");
const jwt = require("jsonwebtoken");
const redis = require("../../../util/cache");

router.post("/", multer().none(), async function (req, res, next) {
  const email = req.body.email;
  let sqlres, cacheres;
  let userProfile;
  const password = encryption(req.body.password);
  cacheres = await redis.get(`${email}${password}`);
  let sql = `SELECT user.id,user.name,user.email,user.password 
                FROM user
                WHERE user.email= ? AND user.password = ? `;
  if (!cacheres) {
    console.log("Get data from DB");
    try {
      sqlres = await db.query({ sql: sql, values: [email, password] });
    } catch (error) {
      return res.status(403).send({ code: 401, description: error });
    }
    if (sqlres[0].length < 1)
      return res
        .status(401)
        .send({ code: 401, description: "email or password incorrect" });
    userProfile = sqlres[0][0];
    await redis.set(`${email}${password}`, `${JSON.stringify(userProfile)}`);
  } 
  else {
    console.log("Get data from Cache");
    userProfile = JSON.parse(cacheres);
  }
  const jwtHeader = { alg: "HS512", typ: "JWT" };
  const jwtPayload = { id: userProfile.id, name: userProfile.name, email: userProfile.email };
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "30 day",
    header: jwtHeader,
  });
  
  res
    .status(200)
    .send({ code: 200, description: "success signin", token: token });
  
  try {
    sql = `UPDATE user SET token = ? WHERE user.id = ?`;
    await db.query({ sql: sql, values: [token, userProfile.id] });
  } catch (error) {
    return res.send({ code: 403, description: error });
  }

});

module.exports = router;

//8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
