const express = require('express');
const router = express.Router();
const db = require('../../../util/database');


module.exports = router;

router.get('/', async function (req, res, next) {
    const keyword = '%'+req.query.keyword+'%';
    const sql = `SELECT baseID as id ,base.name, base.prices,base.photoURL,base.details,base.description,
    JSON_ARRAYAGG(color.color)   as 'color'
    FROM ( allProduct LEFT JOIN base ON baseID = base.id)
    LEFT JOIN color ON allProduct.colorID = color.id  
    WHERE base.name LIKE ? GROUP BY id ORDER BY id;`;
    const getSearch = await db.query({
                sql: sql,
                values: [keyword]
            });
    let msg = {"peoduct":getSearch[0]};
    res.send(msg);
});