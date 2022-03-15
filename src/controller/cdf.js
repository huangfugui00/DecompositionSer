const Cdf = require('../utils/cdf')
// import Cdf from '../utils/cdf'

const Utils = require('../utils/util')

class CDFSer{
    async readCDF(req,res,next){
        // const cdfObj=new Cdf('static/cdf/6Components_Agilent.CDF')
        // const cdfObj=new Cdf(process.cwd()+'/src/static/cdf/6Components_Agilent.CDF')
        console.log('start read')
        const cdfObj=new Cdf('D:\\project\\js\\expressSer-main\\src\\static\\cdf\\6Components_Agilent.CDF')
        await cdfObj.readCDF()
        console.log('finish read cdf file')
        const data=cdfObj
        return Utils.responseClient(res,1,200,'移除feeling成功',data);
    }
}

module.exports = CDFSer
