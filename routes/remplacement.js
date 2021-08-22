const {Remplacement} = require('../models/remplacement');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Nomenclature } = require('../models/nomenclature');


router.get(`/`, async (req, res) => {
   // populate just remplace to show compose && composant -- and keep remplacant just with ids.
    const remplacementList = await Remplacement.find().populate([{path: 'remplace', populate : [{path: 'compose'}, { path: 'composant'}]}, { path: 'remplacant'}]);
    if(!remplacementList) {
      res.status(500).json({success: false, message: "no remplacements for the moment"})
    } 
    res.send(remplacementList);
})

router.post(`/`, async (req, res) => {

    // I will just go with id instead of reference -- cahier de charge us reference. 
    if(!mongoose.isValidObjectId(req.body.remplace) || !mongoose.isValidObjectId(req.body.remplacant)) {
      return res.status(400).send('Invalid remplace or remplacant Id')
    }
    // the diffrnt between the first validation and next one is just if u write wrong id -- length -- 
    const remplace = await Nomenclature.findById(req.body.remplace);
    if(!remplace) return res.status(400).send('Invalid remplace')

    const remplacant = await Nomenclature.findById(req.body.remplacant);
    if(!remplacant) return res.status(400).send('Invalid remplacant')

    const remplacementBody = {
      remplace: req.body.remplace,
      remplacant: req.body.remplacant,
      date_de_remplacement: req.body.date_de_remplacement
    }

    let remplacement = new Remplacement(remplacementBody);
    var {error} = remplacement.joiValidate(remplacementBody);
    if (error) {
      // on fail return comma separated errors
      return res.status(400).json(error.details[0]);
    }
    remplacement = await remplacement.save();
    if(!remplacement) 
    return res.status(500).send('The remplacement cannot be created')
    res.send(remplacement);
})

router.put('/:id',async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid Remplacement Id')
    }
    // I will just go with id instead of reference -- cahier de charge us reference. 
    if(!mongoose.isValidObjectId(req.body.remplace) || !mongoose.isValidObjectId(req.body.remplacant)) {
      return res.status(400).send('Invalid Nomenclature Id')
    }
    const remplace = await Nomenclature.findById(req.body.remplace);
    if(!remplace) return res.status(400).send('Invalid remplace')

    const remplacant = await Nomenclature.findById(req.body.remplacant);
    if(!remplacant) return res.status(400).send('Invalid remplacant')

    const remplacementBody = {
      remplace: req.body.remplace,
      remplacant: req.body.remplacant,
      date_de_remplacement: req.body.date_de_remplacement
    }

    const remplacement = await Remplacement.findByIdAndUpdate(
      req.params.id,
      remplacementBody,
      { new: true}
    )

    if(!remplacement)
    return res.status(500).send('the remplacement cannot be updated!')

    res.send(remplacement);
})

router.delete('/:id', (req, res)=>{
    Remplacement.findByIdAndRemove(req.params.id).then(remplacement => {
        if(remplacement) {
            return res.status(200).json({success: true, message: 'the remplacement is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "remplacement not found!"})
        }
    }).catch(err=>{
      return res.status(500).json({success: false, error: err}) 
    })
})

module.exports = router;
