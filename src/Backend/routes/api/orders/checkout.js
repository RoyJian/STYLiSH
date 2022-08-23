const express = require('express');
const router = express.Router();
const db = require('../../../util/database');
const authentication = require('../../../util/tokenvertify');
const multer = require('multer');
const axios = require('axios').default;



router.post('/',multer().none(),authentication,async function (req, res, next) {
    const userID = req.user.id;
    const {prime,order,email,total,phone,name,address} = req.body;
    const now = new Date();
    const number = '' + now.getMonth() + now.getDate() + (now.getTime() % (24 * 60 * 60 * 1000)) + Math.floor(Math.random() * 10);
    const orderRecord = {
        number: number,
        userID: userID,
        details: JSON.stringify(order),
        total: total,
        isPaid: 0, // -1 for init (not pay yet)
        time: now.getTime(),
    };
    let sql,sqlres,orderID;
    if (!order || !total || !prime || !email) {
        res.status(400).send({ error: 'Create Order Error: Wrong Data Format' });
        return;
    }
    await db.query({sql:`SET autocommit = 0;`,});
    sql = ` INSERT INTO orders set ? ;`
    sqlres = await db.query({
        sql:sql,
        values: orderRecord
    });
    orderID = sqlres[0]['insertId'];
    const products = order.map((item)=>item.name);
    const orderInformation = {
        "prime": prime,
        "partner_key": process.env.Partner_Key,
        "merchant_id":  process.env.Merchant_ID,
        "details":JSON.stringify(products),
        "amount": parseInt( total),
        "cardholder": {
            "phone_number": phone,
            "name": name,
            "email": email,
            "zip_code": "12345",
            "address": address,
            "national_id": "A123456789"
        },
        "remember": true
      }
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.post['x-api-key'] = process.env.Partner_Key;

    axios.post("https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",orderInformation).then(async (response)=>{
        if(response.data.status == 0){
            res.status(200).send({code:200,description:"Success checck out order.",number:number});
            db.query({sql:'SET autocommit = 1;'});
            sql = `UPDATE orders SET isPaid = 1 WHERE orders.id = ?`;
            db.query({sql:sql,values:[orderID]});
        }
        else{
            res.status(400).send({code:400,description:response.data.msg});
            await db.query({sql:'rollback;'});
            db.query({sql:'SET autocommit = 1;'});
        }
        console.log(response.data)
        
    }).catch(async(error)=>{
        console.log(error.response.body)
        res.status(400).send({code:400,description:error.response.body.msg});
        await db.query({sql:'rollback;'});
        db.query({sql:'SET autocommit = 1;'});
    });
    
});
module.exports = router;