const {Article} = require('../models/article');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get(`/`, async (req, res) => {
    const articleList = await Article.find();
    if(!articleList) {
      res.status(500).json({success: false, message: "no articles for the moment"})
    } 
    res.send(articleList);
})

router.get(`/:reference`, async (req, res) =>{
    const article = await Article.findOne({reference: req.params.reference});
    if(!article) {
      res.status(500).json({success: false, message: "no article found with this reference"})
    } 
    res.send(article);
})

router.post(`/`, async (req, res) => {
    let article = new Article(req.body);
    var {error} = article.joiValidate(req.body);
    if (error) {
      // on fail return comma separated errors
      return res.status(400).json(error.details[0]);
    }
    article = await article.save();
    if(!article) 
    return res.status(500).send('The article cannot be created')
    res.send(article);
})

router.put('/:id',async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
       return res.status(400).send('Invalid Article Id')
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    const article = await Article.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
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

router.get(`/get/count`, async (req, res) =>{
    const articleCount = await Article.countDocuments((count) => count)

    if(!articleCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        articleCount: articleCount
    });
})

router.get(`/get/featured/:count`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const articles = await Article.find({isFeatured: true}).limit(+count);

    if(!articles) {
        res.status(500).json({success: false})
    } 
    res.send(articles);
})

module.exports = router;
