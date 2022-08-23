const jwt = require('jsonwebtoken');
const authentication = (req, res, next) => {

    let token;
    try {
        token = req.headers["authorization"].replace('Bearer ', ''); // 從請求 headers 中找 token
        
    } catch (e) {
        token = "";
    }
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" }); // 失敗時回傳 Unauthorized 錯誤訊息
        } else {
            req.user = decoded;
            next(); // 成功則繼續進行請求
        }
    });
};

module.exports = authentication;