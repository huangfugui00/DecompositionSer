const Utils = require('../utils/util')
const Decomposite = require('../utils/decomposite')
const DecompositeCorr = require('../utils/decompositeCorr')

class DecompositeSer{
    async decomposite(req,res,next){
        console.log('decomposite')
        try {
            const data = JSON.parse(req.body.data)
            const decompositeObj = new DecompositeCorr(data.mzArr,data.scanTimes,data.alignPeaks)
            await decompositeObj.decomposite()
            return Utils.responseClient(res,1,200,'',decompositeObj.estList);
        }
        catch (err){
            return Utils.responseClient(res,0,500,err.message);
        }
    }
}

module.exports = DecompositeSer