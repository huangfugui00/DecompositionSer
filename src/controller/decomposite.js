const Utils = require('../utils/util')
const Decomposite = require('../utils/decomposite')

class DecompositeSer{
    async decomposite(req,res,next){
        console.log('decomposite')
        try {
            const data = JSON.parse(req.body.data)
            const decompositeObj = new Decomposite(data.mzArr,data.scanTimes,data.alignPeaks)
            await decompositeObj.decomposite()
            return Utils.responseClient(res,1,200,'',decompositeObj.estList);
        }
        catch (err){
            return Utils.responseClient(res,0,500,'err',err);
        }
    }
}

module.exports = DecompositeSer