const express = require('express');
const router = express.Router();
const db = require('../../../util/database');




router.get('/', async function (req, res, next) {
    const id = req.query.id;
    let sql = `SELECT * FROM base WHERE id = ?`;
    const getProduct = await db.query({
        sql: sql,
        values: [id]
    });
    sql = `
        SELECT color,color.name as colorName,size,counts 
        FROM (allProduct JOIN size on sizeID = size.id)
        JOIN color ON colorID = color.id
        WHERE baseID = ? `;
    const getFormat = await db.query({
        sql: sql,
        values: [id]
    });
    let msg = {
        'product': getProduct[0],
        'spec': getFormat[0]
    };
    res.send(msg);
});
module.exports = router;