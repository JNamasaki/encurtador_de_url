var express = require('express');
var router = express.Router();
const link = require('../models/link');
const Link = require('../models/link');

function generateCode(){
  var text = '';
  const possible = 'lABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) 
    text += possible.charAt(Math.floor(Math.random()* possible.length));
    
  return text;
}

router.get('/:code', async (req,res,next)=>{
  const code = req.params.code;

  const resultado= await link.findOne({where:{code}});
  if (!resultado) return res.sendStatus(404);

  resultado.hits++;
  await resultado.save();
  res.redirect(resultado.url);
});
router.get('/:code/stats', async (req,res,next)=>{
  const code = req.params.code;

  const resultado= await link.findOne({where:{code}});
  if (!resultado) return res.sendStatus(404);
  res.render('stats',resultado.dataValues)
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Encurtador de URL' });
});

router.post('/new', async(req,res,next) => {
  const url = req.body.url;
  const code = generateCode();
  const resultado = await link.create({
    url,
    code
  });

  res.render('stats', resultado.dataValues);
});
module.exports = router;
