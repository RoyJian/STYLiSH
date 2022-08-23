const express = require('express');
const router = express.Router();
const db = require('../../../util/database');
// const authentication = require('../../../util/tokenvertify');
const axios = require('axios').default;

router.get('/',async function (req, res, next){
    const sql = 'SELECT total,details FROM `orders`'
    const [sqlRes] = await db.query(sql);
    const resData = sqlRes.map((order)=>{
        const total = order.total;
        let list = order.details;
        list = list.map((item)=>{
            return {
                id: item.baseID,
                price: item.price,
                color:{
                   code: item.color
                },
                size:item.size,
                qty:parseInt(item.orderCounts)
            }
        })
        return {
            total,
            list
        }
    })
    res.json(resData);
});

module.exports = router;