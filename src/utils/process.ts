const smooth = require('array-smooth')

class Process{
    constructor() {

    }
    avgSmooth(y:number[],windowSize=2){
        return smooth(y,windowSize)
    }

}

module.exports=Process