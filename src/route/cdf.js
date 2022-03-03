const express = require('express')
const router = express.Router()
const CDFSer = require('../controller/cdf')
const cdfSer =new CDFSer;
router.get('/',cdfSer.readCDF)

module.exports=router