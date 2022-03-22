const express = require('express')
const router = express.Router()
const NistSer = require('../controller/nist')
const nistSer =new NistSer;

router.post('/',nistSer.nistCompare)

module.exports=router