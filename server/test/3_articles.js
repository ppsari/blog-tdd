const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../app');
const should = chai.should();
var Article = require('../models/article');
let _id;
let _author;
let token;

describe('Article', ()=>{

  before(done=>{
    token  = global._token;
    _author = global._userid;
    // if (token) {
    //   helper.authArticle(token, (err,decoded)=> {
    //     if (!err) _author = decoded.author;
    //     else console.log('err auth before : '+err);
    //   })
    //   console.log('kita ambil token_'+token);
    // }
    done();
  });

//tanpa token
  describe('GET /articles', ()=>{
    it('should get all articles', (done)=> {
      chai.request(server)
      .get('/api/articles')
      .end((err,articles)=>{
        if (err) done(err);
        if (articles.hasOwnProperty('error')) done(err);
        else {
          articles.should.have.status(200);
          articles.body.should.be.a('array');
          articles.body.length.should.equal(0);
          done();
        }
      });
    });
  })
//end tanpatoken
  describe('POST /articles', ()=>{
    it('should create an article', (done)=>{
      let title =  'Artikel baru';
      let descr = 'Artikel apa ini. Dilema senin pagi';

      let newArticle = {
        title: title,
        descr: descr,
        createdAt: new Date()
      }
      chai.request(server)
      .post('/api/articles')
      .set('token', token)
      .send(newArticle)
      .end((err,article)=>{
        // console.log(err);
        if (err) done(err);
        else {
          article.should.have.status(200);
          article.body.should.be.a('object');
          article.body.should.have.property('title',title);
          article.body.should.have.property('descr',descr);
          article.body.should.have.property('author');
          article.body.should.have.property('createdAt');
          article.body.should.have.property('_id');
          _id = article.body._id;
          done();
        }

      });
    });
  });

  describe('POST /articles', ()=>{
    it('should not create an article wo descr,title', (done)=>{
      let newArticle = {
        createdAt: new Date()
      }
      chai.request(server)
      .post('/api/articles')
      .send(newArticle)
      .set('token', token)
      .end((err,article)=> {
        if (err) done(err);
        else {
          article.should.have.status(200);
          article.body.should.be.a('object');
          article.body.should.have.property('error');
          done();
        }
      });

    });
  });

//tanpa token
  describe('GET /articles:id', ()=>{
    it('should get an article by id', (done)=>{
      chai.request(server)
      .get('/api/articles/'+_id)
      .end((err,article)=>{
        if (err) done(err);
        else {
          article.should.have.status(200);
          article.body.should.be.a('object');
          article.body.should.have.property('title');
          article.body.should.have.property('author');
          article.body.should.have.property('descr');
          article.body.should.have.property('createdAt');
          done();
        }

      });
    });
  });
//end tanpatoken

  describe('PUT /articles:id', ()=>{
    it('should edit an article by id', (done)=>{
      let title =  'Artikel ed';
      let descr = 'Artikel apa ini. Dilema senin pagi edited';
      let updArticle = {
        title: title,
        author: _author,
        descr: descr,
        createdAt: new Date()
      }
      chai.request(server)
      .put('/api/articles/'+_id)
      .send(updArticle)
      .set('token', token)
      .end((err,article)=>{
        if (err) done(err)
        else {
          article.should.have.status(200);
          article.body.should.be.a('object');
          article.body.should.have.property('title',title);
          article.body.should.have.property('descr',descr);
          article.body.should.have.property('createdAt');
          article.body.should.have.property('_id').eql(_id);
          done();
        }

      })
    });
  })

  describe('DELETE /articles:id', ()=>{
    it('should delete an article by id', (done)=>{
      chai.request(server)
      .delete('/api/articles/'+_id)
      .send({author:_author})
      .set('token', token)
      .end((err,article)=>{
        if (err) done(err);
        else {
          article.should.have.status(200);
          article.body.should.be.a('object');
          article.body.should.have.property('_id').eql(_id);
          done();
        }

      })
    });
  })

  after(done=>{
    Article.remove({},err=>{done();});
  })


})

