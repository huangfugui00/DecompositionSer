const Utils = require('../utils/util')
const Decomposite = require('../utils/decomposite')

class DecompositeSer{
    async decomposite(req,res,next){
        console.log('decomposite')
        try {
            const data = req.body
            const decompositeObj = new Decomposite(data.mzArr,data.scanTimes,data.alignPeaks)
            await decompositeObj.decomposite()
            return Utils.responseClient(res,1,200,'',data);
        }
        catch (err){
            return Utils.responseClient(res,0,500,'err',err);
        }
    }
}

module.exports = DecompositeSer