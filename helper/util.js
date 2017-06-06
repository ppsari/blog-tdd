const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const page_article = {
  "mtd" : {
    PUT: 'id',
    DELETE: 'id',
    POST : 'login'
  }
}

const createToken = (user) => {
  return jwt.sign(user,SECRET_KEY);
}

const hashPassword = (pass) => {
  let encpass= CryptoJS.AES.encrypt(pass, SECRET_KEY).toString();
  return encpass;
}

const checkPassword = (pass,hashPass) => {
  let plainpass = CryptoJS.AES.decrypt(hashPass,SECRET_KEY).toString(CryptoJS.enc.Utf8);
  return plainpass === pass;
}

//cuma di RUD article saja
const authArticle = (req,res,next) => {
  // console.log(page_article.mtd);
  let method = req.method;
  let flag = page_article.mtd.hasOwnProperty(method);
  if (flag) {
    // console.log('kita cek ya');
    if (req.headers.token) {
      if (page_article.mtd[method] === 'id') {
        getUserId(req.headers.token, (err,decoded)=>{
          if (decoded.id == req.body.author) next();
          else res.send({error: 'You dont have access'})
        })
      } else next();
    }
    else res.send({error: 'You must login'});
  }
  else next();
}

const getUserId = (token,callback) => {
  jwt.verify(token,SECRET_KEY, callback)
}

module.exports = {
  hashPassword,
  getUserId,
  createToken,
  authArticle,
  checkPassword
}