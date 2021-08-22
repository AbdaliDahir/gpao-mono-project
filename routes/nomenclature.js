const {Nomenclature} = require('../models/nomenclature');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Article } = require('../models/article');


router.get(`/`, async (req, res) => {
  // populate to show full article not just id.
    const nomenclatureList = await Nomenclature.find().populate([{path: 'compose'}, { path: 'composant'}]);
    if(!nomenclatureList) {
      res.status(500).json({success: false, message: "no nomenclatures for the moment"})
    } 
    res.send(nomenclatureList);
})

router.post(`/`, async (req, res) => {

    // I will just go with id instead of reference -- cahier de charge us reference. 
    if(!mongoose.isValidObjectId(req.body.compose) || !mongoose.isValidObjectId(req.body.composant)) {
      return res.status(400).send('Invalid compose or composant Id')
    }
    // the diffrnt between the first validation and next one is just if u write wrong id -- length -- 
    const compose = await Article.findById(req.body.compose);
    if(!compose) return res.status(400).send('Invalid compose')

    const composant = await Article.findById(req.body.composant);
    if(!composant) return res.status(400).send('Invalid composant')

    const nomenclatureBody = {
      compose: req.body.compose,
      composant: req.body.composant,
      quantite_de_composition: req.body.quantite_de_composition
    }

    let nomenclature = new Nomenclature(nomenclatureBody);
    var {error} = nomenclature.joiValidate(nomenclatureBody);
    if (error) {
      // on fail return comma separated errors
      return res.status(400).json(error.details[0]);
    }
    nomenclature = await nomenclature.save();
    if(!nomenclature) 
    return res.status(500).send('The nomenclature cannot be created')
    res.send(nomenclature);
})

router.put('/:id',async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid Nomenclature Id')
    }
    // I will just go with id instead of reference -- cahier de charge us reference. 
    if(!mongoose.isValidObjectId(req.body.compose) || !mongoose.isValidObjectId(req.body.composant)) {
      return res.status(400).send('Invalid Article Id')
    }
    const compose = await Article.findById(req.body.compose);
    if(!compose) return res.status(400).send('Invalid compose')

    const composant = await Article.findById(req.body.composant);
    if(!composant) return res.status(400).send('Invalid composant')

    const nomenclatureBody = {
      compose: req.body.compose,
      composant: req.body.composant,
      quantite_de_composition: req.body.quantite_de_composition
    }

    const nomenclature = await Nomenclature.findByIdAndUpdate(
      req.params.id,
      nomenclatureBody,
      { new: true}
    )

    if(!nomenclature)
    return res.status(500).send('the nomenclature cannot be updated!')

    res.send(nomenclature);
})

router.delete('/:id', (req, res)=>{
    Nomenclature.findByIdAndRemove(req.params.id).then(nomenclature => {
        if(nomenclature) {
            return res.status(200).json({success: true, message: 'the nomenclature is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "nomenclature not found!"})
        }
    }).catch(err=>{
      return res.status(500).json({success: false, error: err}) 
    })
})

module.exports = router;
