const {Article} = require('../models/article');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Stock } = require('../models/stock');


router.get(`/`, async (req, res) => {
    const articleList = await Article.find().populate('Stock');
    if(!articleList) {
      res.status(500).json({success: false, message: "no articles for the moment"})
    } 
    res.send(articleList);
})

router.get(`/:reference`, async (req, res) =>{
    const article = await Article.findOne({reference: req.params.reference})
    .populate({
      path: 'stocks'
    });
    if(!article) {
      res.status(500).json({success: false, message: "no article found with this reference"})
    } 
    res.send(article);
})

router.post(`/`, async (req, res) => {
    // stocks
    const stocksIds = Promise.all(req.body.stocks.map(async (stockItems) =>{
      let newStock = new Stock({
          nmbr_magasin: stockItems.nmbr_magasin,
          quantity: stockItems.quantity,
          periode: stockItems.periode,
          stock_type: stockItems.stock_type
      })

      newStock = await newStock.save();

      return newStock._id;

    }))
    // TODO:: Maybe we will used for manage MIN/MAX stock -- if we try to go deep.
    const stocksIdsResolved = await stocksIds;
    const orderRequest = {
      reference: req.body.reference,
      designation: req.body.designation,
      type_fabrication_achat: req.body.type_fabrication_achat,
        unite_achat_stock: req.body.unite_achat_stock,
        delai_en_semaine: req.body.delai_en_semaine,
        prix_standard: req.body.prix_standard,
        lot_de_reapprovisionnement: req.body.lot_de_reapprovisionnement,
        stock_mini: req.body.stock_mini,
        stock_maxi: req.body.stock_maxi,
        pourcentage_de_perte: req.body.pourcentage_de_perte,
        inventaire: req.body.inventaire,
        PF_ou_MP_ou_Piece_ou_SE: req.body.PF_ou_MP_ou_Piece_ou_SE,
        stocks: stocksIdsResolved,
    }
    // article
    let article = new Article(orderRequest);
    // if(stocksIdsResolved.length) {
    //   console.log(stocksIdsResolved);
    //   article.put(stocksIdsResolved);
    // }
    var {error} = article.joiValidate(orderRequest);
    if (error) {
      // on fail return comma separated errors
      return res.status(400).json(error.details[0]);
    }
    article = await article.save();
    if(!article) 
    return res.status(500).send('The article cannot be created')
    res.send(article);
})

// TODO :: not completed.
router.put('/:id/:reference',async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid Article Id')
    }

    const article = await Article.findOneAndUpdate(
      {reference: req.params.reference},
      req.body,
      { new: true}
    )

    if(!article)
    return res.status(500).send('the article cannot be updated!')

    res.send(article);
})

router.delete('/:id', (req, res)=>{
    Article.findByIdAndRemove(req.params.id).then(article =>{
        if(article) {
            return res.status(200).json({success: true, message: 'the article is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "article not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports = router;
