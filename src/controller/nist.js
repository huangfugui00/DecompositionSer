const NistCompare = require('../utils/nistCompare')
const Utils = require('../utils/util')

class Nist{
    async nistCompare(req,res,next) {
        console.log('nistCompare')
        try {
            const nistData =req.body.nistData
            const nistCompareObj = new NistCompare()
            await nistCompareObj.generateFile(nistData)
            await nistCompareObj.execNist()
            const resultJson = await nistCompareObj.resultToJson()
            console.log(resultJson)
            if(resultJson){
                return Utils.responseClient(res,1,200,'生成NIST峰文件成功',resultJson);
            }
            else {
                return Utils.responseClient(res,0,200,'NIST解谱成功，但未获得有效结果')
            }
        }
        catch (e) {
            return Utils.responseClient(res, 0, 500, e);
        }
    }
}

module.exports = Nist
