const express = require('express');
const router = express.Router();
const authentication = require('../../../util/tokenvertify');

router.get('/',authentication, async function (req, res) {
    res.status(200).send({status:200,user:req.user})
});

module.exports = router;