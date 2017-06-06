let Article = require('../models/article');
let helper = require('../helper/util');

const getAll = (req,res) => {
  Article.find((err,articles)=>{
    res.send(articles);
  })
}
const getByID = (req,res) => {
  // console.log('nemu kah getbyid : '+req.params.hasOwnProperty('id'))
  if (req.params.hasOwnProperty('id')) {
    Article.findById(req.params.id, (err,article) => {
        res.send(err? {error:err} : article)
      }
    )
  } else res.send({error:'ID not defined'})
}
const postArticle = (req,res) => {
  let article = req.body;
  helper.getUserId(req.headers.token, (err,decoded)=> {
    if (!err) {
      article.author = decoded.id;
      let newArticle = new Article(article);
      newArticle.save((err,article) => {
        if (err) {
          let err_msg = '';
          for (let error in err.errors) err_msg += err.errors[error].message+'\n';
          if (err.code == 11000) err_msg+= `Username exist`;
          res.send({error:err_msg})
        }
        res.send(article);
      });
    } else res.send({error:'You must login'})
  })

}

const putArticle = (req,res) => {
  if (req.params.hasOwnProperty('id')) {
    Article.findById(req.params.id, (err,article) => {
        if (err) res.send({error:err});
        else {
          for(let key in req.body) article[key] = req.body[key];
          article.save((err,article) => {
            if (err) {
              let err_msg = '';
              for (let error in err.errors) err_msg += err.errors[error].message+'\n';
              res.send({error:err_msg})
            }
            // console.log(article)
            res.send(article);
          });
        }//end if
      }//end callback
    )//end findbyid
  } else res.send({error:'ID not defined'})
}

const deleteArticle = (req,res) => {
  if (req.params.hasOwnProperty('id')) {
    Article.findById(req.params.id, (err,article)=>{
      if (err) res.send({error : err});
      else {
        article.remove((err,article)=>{
          // if(!err) article.msg = 'Article deleted';
          res.send(err?{error:err}:article);
        })
      }
    })
  } else res.send({error:'ID not defined'})
}



module.exports = {
  getAll,
  getByID,
  postArticle,
  putArticle,
  deleteArticle
}