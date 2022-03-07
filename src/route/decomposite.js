const express = require('express')
const router = express.Router()
const DecompositeSer = require('../controller/decomposite')
const decompositeSer =new DecompositeSer;

router.post('/',decompositeSer.decomposite)

module.exports=router