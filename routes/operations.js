const {Operation} = require('../models/operation');
const express = require('express');
const { Article } = require('../models/article');
const router = express.Router();
const mongoose = require('mongoose');
const { PostCharge } = require('../models/post_charge');


router.get(`/`, async (req, res) => {
  // localhost:3000/api/v1/operations?articles=2342342
  let filter = {};
  if(req.query.articles)
  {
    filter = {article: req.query.articles.split(',')}
  }

  const operationList = await Operation.find(filter).populate('article', 'postCharge');

  if(!operationList) {
    res.status(500).json({success: false})
  } 
  res.send(operationList);
})

router.get(`/:id`, async (req, res) => {
    const operation = await Operation.findById(req.params.id).populate('article', 'postCharge');

    if(!operation) {
        res.status(500).json({success: false})
    } 
    res.send(operation);
})

router.post(`/`, async (req, res) => {

    //TODO :: Maybe need to use reference instead of ID.
    if(!mongoose.isValidObjectId(req.body.article)) {
      return res.status(400).send('Invalid Article Id')
    }
    const article = await Article.findById(req.body.article);
    if(!article) return res.status(400).send('Invalid Article')

    if(req.body.post_charge) {
      if(!mongoose.isValidObjectId(req.body.post_charge)) {
        return res.status(400).send('Invalid PostCharge Id')
      }
      const postCharge = await PostCharge.findById(req.body.post_charge);
      if(!postCharge) return res.status(400).send('Invalid Post')
    }

    let operation = new Operation({
      numero_operation: req.body.numero_operation,
      temps_preparation: req.body.temps_preparation,
      temps_execution: req.body.temps_execution,
      temps_transfert: req.body.temps_transfert,
      libelle_operation: req.body.libelle_operation,
      article: req.body.article,
      postCharge: req.body.post_charge
    })

    operation = await operation.save();

    if(!operation) 
    return res.status(500).send('The operation cannot be created')

    res.send(operation);
})

router.put('/:id',async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid Operation Id')
    }
    const article = await Article.findById(req.body.article);
    if(!article) return res.status(400).send('Invalid Article')

    // TODO :: check relation between article and opeartion before update -- more logic .

    if(req.body.post_charge) {
      if(!mongoose.isValidObjectId(req.body.post_charge)) {
        return res.status(400).send('Invalid PostCharge Id')
      }
      const postCharge = await PostCharge.findById(req.body.post_charge);
      if(!postCharge) return res.status(400).send('Invalid Post')
    }

    const operation = await Operation.findByIdAndUpdate(
        req.params.id,
        {
          numero_operation: req.body.numero_operation,
          temps_preparation: req.body.temps_preparation,
          temps_execution: req.body.temps_execution,
          temps_transfert: req.body.temps_transfert,
          libelle_operation: req.body.libelle_operation,
          postCharge: req.body.post_charge
        },
        { new: true}
    )

    if(!operation)
    return res.status(500).send('the operation cannot be updated!')

    res.send(operation);
})

router.delete('/:id', (req, res)=>{
    Operation.findByIdAndRemove(req.params.id).then(operation =>{
        if(operation) {
            return res.status(200).json({success: true, message: 'the operation is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "operation with that [Id] did not found!"})
        }
    }).catch(err=>{
      return res.status(500).json({success: false, error: err}) 
    })
})

module.exports = router;
