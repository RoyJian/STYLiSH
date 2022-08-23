const express = require("express");
const router = express.Router();
const db = require("../../../util/database");
const redis = require("../../../util/cache");

router.get("/:catalog", async function (req, res, next) {
  const catalogs = { women: 1, men: 2, accessories: 3 };
  let startIndex = 6 * parseInt(req.query.paging) || 0;
  let redRes, sqlRes;
  redRes = await redis.get(`${req.params.catalog}${req.query.paging}`);
  if (redRes) {
    console.log("Res send by cache");
    res.send(redRes);
    return;
  }
  const sql = `SELECT baseID as id ,base.name, base.prices,base.photoURL,base.details,base.description,
                JSON_ARRAYAGG(color.color)   as 'color'
                FROM (
                        allProduct 
                        LEFT JOIN base ON baseID = base.id
                      )
                    LEFT JOIN color ON allProduct.colorID =color.id  
                    WHERE catalogID = ?
                    GROUP BY allProduct.baseID
                    ORDER BY allProduct.baseID
                    LIMIT ${startIndex},7;`;
  sqlRes = await db.query({
    sql: sql,
    values: [catalogs[req.params.catalog]],
  });
  let msg = {};
  msg.product = sqlRes[0].slice(0, 6);
  if (sqlRes[0].length > 6) msg.next_paging = startIndex + 1;
  await redis.set(
    `${req.params.catalog}${req.query.paging}`,
    `${JSON.stringify(msg)}`
  );
  console.log("res send by sql");
  res.send(msg);
});

module.exports = router;
