const Cdf = require('../utils/cdf')
const Utils = require('../utils/util')

class CDFSer{
    async readCDF(req,res,next){
        console.log('start read')
        const cdfObj=new Cdf(process.cwd()+'/src/static/cdf/6Components_Agilent.CDF')
        await cdfObj.readCDF()
        console.log('finish read cdf file')
        const data=cdfObj
        return Utils.responseClient(res,1,200,'移除feeling成功',data);
    }

    async loadCDF(req,res,next){
        console.log('loadCDF')
        req.body
        return Utils.responseClient(res,1,200,'loadCDF成功');
    }
}

module.exports = CDFSer
