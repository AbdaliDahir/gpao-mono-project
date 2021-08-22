const {PostCharge} = require('../models/post_charge');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Stock } = require('../models/stock');


router.get(`/`, async (req, res) => {
    const postChargeList = await PostCharge.find();
    if(!postChargeList) {
      res.status(500).json({success: false, message: "no postCharges for the moment"})
    } 
    res.send(postChargeList);
})

router.post(`/`, async (req, res) => {
    // postCharge -- req.body directly ?? :).
    let postCharge = new PostCharge(req.body);
    var {error} = postCharge.joiValidate(req.body);
    if (error) {
      // on fail return comma separated errors
      return res.status(400).json(error.details[0]);
    }
    postCharge = await postCharge.save();
    if(!postCharge) 
    return res.status(500).send('The postCharge cannot be created')
    res.send(postCharge);
})

router.put('/:id',async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid PostCharge Id')
    }

    const postCharge = await PostCharge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true}
    )

    if(!postCharge)
    return res.status(500).send('the postCharge cannot be updated!')

    res.send(postCharge);
})

router.delete('/:id', (req, res)=>{
    PostCharge.findByIdAndRemove(req.params.id).then(postCharge => {
        if(postCharge) {
            return res.status(200).json({success: true, message: 'the postCharge is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "postCharge not found!"})
        }
    }).catch(err=>{
      return res.status(500).json({success: false, error: err}) 
    })
})

module.exports = router;
