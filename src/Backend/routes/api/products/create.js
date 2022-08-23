require('dotenv').config()
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const db = require('../../../util/database');
const dir = path.resolve(__dirname, '../../../static/img');
const bodyParser = require('body-parser');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, req.body.productName + '.jpg');
  }
});

const upload = multer({
  storage: storage,
});

router.post('/', upload.single('updateFile'), async function (req, res, next) {
  const filename = req.body.productName + '.jpg';
  const url = path.join('/api', '/public/img', filename)
  const formData = req.body;

  const catalog = formData.catalog;
  const base = [formData.productName, formData.price, formData.details, formData.description, url, formData.productName]
  let color = formData.color;
  let size = formData.size;
  let counts = formData.amount;
  let sqlRes;
  let colorID, sizeID
  let catalogID, baseID;
  let sql;

  //BaseID
  sql = `INSERT INTO base(name,prices,details,description,photoURL) SELECT ?,?,?,?,? FROM DUAL WHERE NOT EXISTS (SELECT name FROM base WHERE name = ? );`;
  sqlRes = await db.query({
    sql: sql,
    values: base
  });
  baseID = sqlRes[0]['insertId']
  if (baseID == 0) {
    sql = `SELECT id FROM base WHERE name = ? ;`
    sqlRes = await db.query({
      sql: sql,
      values: [base[0]]
    });
    baseID = sqlRes[0][0]['id'];
  }

  res.send({
    status: 201,
    msg: 'success',
    id: baseID
  });

  //getColorID
  if (!Array.isArray(color))
    color = [color];
  colorID = new Array();
  for (let index = 0; index < color.length; index++) {
    sql = `INSERT INTO color(color) SELECT ? FROM DUAL WHERE NOT EXISTS (SELECT color FROM color WHERE color = ? );`;
    sqlRes = await db.query({
      sql: sql,
      values: [color[index], color[index]]
    });
    colorID.push(sqlRes[0]['insertId']);
    if (colorID[index] == 0) {
      sql = `SELECT id FROM color WHERE color = ? ;`;
      sqlRes = await db.query({
        sql: sql,
        values: [color[index]]
      });
      colorID[index] = sqlRes[0][0]['id'];
    }

  }


  // getSizeID
  if (!Array.isArray(size))
    size = [size];
  sizeID = new Array();
  for (let index = 0; index < size.length; index++) {
    sql = `SELECT id FROM size WHERE size = ? ;`;
    sqlRes = await db.query({
      sql: sql,
      values: [size[index]]
    });
    sizeID.push(sqlRes[0][0]['id']);

  }

  //CatalogID
  sql = `SELECT id FROM catalog WHERE catalog = ? ;`
  sqlRes = await db.query({
    sql: sql,
    values: [catalog]
  });
  catalogID = sqlRes[0][0]['id'];

  // addProduct
  if (!Array.isArray(counts))
    counts = [counts];
  for (let index = 0; index < counts.length; index++) {
    ID = [baseID, colorID[index], sizeID[index], catalogID, counts[index], baseID, colorID[index], sizeID[index], catalogID, counts[index]];
    //sql = 'INSERT INTO allProduct (`id`, `baseID`, `colorID`, `sizeID`, `catalogID`, `counts`) VALUES (NULL, ?, ?, ?, ?, ?);'
    sql = `INSERT INTO allProduct (baseID, colorID, sizeID, catalogID, counts)  SELECT ?, ?, ?, ?, ?
    FROM DUAL WHERE NOT EXISTS(SELECT baseID, colorID, sizeID, catalogID, counts FROM allProduct WHERE baseID = ? AND  colorID = ? AND sizeID = ? AND catalogID = ? AND counts = ? )
    ;`;
    sqlRes = await db.query({
      sql: sql,
      values: ID
    });
  }

});

module.exports = router;
