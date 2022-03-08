import {estType} from './type'

class Decomposite{
    mzLen:number=0
    timeLen:number=0
    mzArr:number[]=[]
    scanTimes:number[]=[]
    alignPeaks:number[][]=[]
    processAlignPeaks:number[][]=[]//处理后的alignPeaks
    minPeakIntensity:number = 0.02
    estList:estType[]=[]

    constructor(mzArr:number[],scanTimes:number[],alignPeaks:number[][]) {
        this.mzArr = mzArr
        this.scanTimes = scanTimes
        this.alignPeaks = alignPeaks
        this.mzLen = mzArr.length
        this.timeLen = scanTimes.length
    }

    isMatrix(arr2:number[][]):boolean{
        const lengths =  arr2.map((arr)=>arr.length)
        if(Math.max(...lengths)===Math.min(...lengths)){
            return true
        }
        return false
    }

    async decomposite(){
        try{
            if(!this.isMatrix(this.alignPeaks)){
                throw Error('alignPeaks is not a matrix')
            }
            //扣背景
            this.processAlignPeaks = this.alignPeaks.map((alignPeak)=>alignPeak.map(x=>x-Math.min(...alignPeak)))
            const maxPeakIntenity = Math.max(...this.processAlignPeaks.map((alignPeaks)=>Math.max(...alignPeaks)))
            this.processAlignPeaks = this.processAlignPeaks.map((alignPeak)=>alignPeak.map((peakIntensity)=>peakIntensity>this.minPeakIntensity*maxPeakIntenity?peakIntensity:0))
            //寻峰
            let peakMz:number[]=[]
            let peakTime:number[]=[]
            for (let i = 0; i < this.mzLen; i++) {
                const mzPeakIntensitys = this.processAlignPeaks.map((alignPeak)=>alignPeak[i])
                const peakIndex = await this.localMax(mzPeakIntensitys)
                if(peakIndex.length>0) {
                    peakMz.push(...new Array(peakIndex.length).fill(this.mzArr[i]))
                    peakTime.push(...peakIndex.map((index) => this.scanTimes[index]))
                }
            }
            let peakIndex = new Array(peakTime.length).fill(0).map((x,i)=>i)
            peakIndex = peakIndex.sort((a,b)=>peakTime[a]>peakTime[b]?1:-1)
            peakMz = peakIndex.map((index)=>peakMz[index])
            peakTime = peakIndex.map((index)=>peakTime[index])
            //获取est
            await this.getEst(peakMz,peakTime)
        }
        catch (err:any){
            throw Error(err)
        }

    }

    async getEst(peakMz:number[],peakTime:number[]){
        const nPeak = peakMz.length
        let tempPeakTime:number[]=[]
        let tempPeakMz:number[]=[]
        tempPeakTime[0] = peakTime[0]
        tempPeakMz[0] = peakMz[0]
        const interVal = this.scanTimes[3]-this.scanTimes[0]
        for (let i = 1; i < nPeak; i++) {
            if(Math.abs(peakTime[i]-tempPeakTime[tempPeakTime.length-1])<interVal){
                tempPeakTime.push(peakTime[i])
                tempPeakMz.push(peakMz[i])
            }
            else if(tempPeakMz.length>=3){
                let est={} as estType
                const peakTimePosition=tempPeakTime.reduce( (a,b)=>a+b,0)/tempPeakTime.length
                const peakTimeIndex = this.getIndex(this.scanTimes,peakTimePosition)
                const componentMz = tempPeakMz.sort()
                const result = await this.getLeftRight(peakTimePosition,componentMz)
                if(!result){
                    throw  Error('left right Err')
                }
                const estCurve = await this.getEstCurve(peakTimeIndex,componentMz,result.leftIdx,result.rightIdx,result.referenceMz)
                est['curve']=estCurve
                est['componentMz']=componentMz
                est['peakTimePostion'] = peakTimePosition
                est['peakTimeIndex'] = peakTimeIndex
                this.estList.push(est)
                tempPeakTime=[]
                tempPeakMz=[]
                tempPeakTime[0] = peakTime[i]
                tempPeakMz[0] = peakMz[i]
            }
            else{
                tempPeakTime=[]
                tempPeakMz=[]
                tempPeakTime[0] = peakTime[i]
                tempPeakMz[0] = peakMz[i]
            }
        }

        if(tempPeakMz.length>=3){
            let est={} as estType
            const peakTimePosition=tempPeakTime.reduce( (a,b)=>a+b,0)/tempPeakTime.length
            const peakTimeIndex = this.getIndex(this.scanTimes,peakTimePosition)
            const componentMz = tempPeakMz.sort()
            const result = await this.getLeftRight(peakTimePosition,componentMz)
            if(!result){
                throw  Error('left right Err')
            }
            const estCurve = await this.getEstCurve(peakTimeIndex,componentMz,result.leftIdx,result.rightIdx,result.referenceMz)
            est['curve']=estCurve
            est['componentMz']=componentMz
            est['peakTimePostion'] = peakTimePosition
            est['peakTimeIndex'] = peakTimeIndex
            this.estList.push(est)
            tempPeakTime=[]
            tempPeakMz=[]
        }
    }

    async getEstCurve(peakTimeIndex:number,componentMz:number[],leftIdx:number,rightIdx:number,referenceMz:number){
        const referenceMzIndex = referenceMz-this.mzArr[0]
        let estCurve:number[]=new Array(this.timeLen).fill(0)
        for (let i = leftIdx; i <rightIdx ; i++) {
            estCurve[i] = this.alignPeaks[i][referenceMz]
        }

        for (let i = 0; i < componentMz.length; i++) {
            if(referenceMz!==componentMz[i]){
                const mz = componentMz[i]
                const mzIndex=mz -this.mzArr[0]
                const rate = this.alignPeaks[peakTimeIndex][mzIndex]/this.alignPeaks[peakTimeIndex][referenceMzIndex]
                let count = 0
                //计算左侧的起始点
                for (let j = peakTimeIndex; j >leftIdx ; j--) {
                    if (count>1){
                        for (let k = leftIdx; k <j ; k++) {
                            estCurve[k] += this.alignPeaks[k][referenceMzIndex]*rate
                        }
                        for (let k = j; k < peakTimeIndex; k++) {
                            estCurve[k] += this.alignPeaks[k][mzIndex]
                        }
                        break
                    }
                    const currRate  = this.alignPeaks[j][mzIndex]/this.alignPeaks[j][referenceMzIndex]
                    if(currRate/rate>3){
                        count=count+1
                    }
                }
                //计算右侧的终止点
                for (let j = peakTimeIndex; j <rightIdx ; j++) {
                    if (count>1){
                        for (let k = j; k <rightIdx ; k++) {
                            estCurve[k] += this.alignPeaks[k][referenceMzIndex]*rate
                        }
                        for (let k = peakTimeIndex; k < j; k++) {
                            estCurve[k] += this.alignPeaks[k][mzIndex]
                        }
                        break
                    }
                    const currRate  = this.alignPeaks[j][mzIndex]/this.alignPeaks[j][referenceMzIndex]
                    if(currRate/rate>3){
                        count=count+1
                    }
                }

            }

        }
        return estCurve

    }

    getIndex(arr:number[],value:number):number{
        let index = arr.indexOf(value)
        if(index===-1){
            const diffArr = arr.map((x)=>Math.abs(x-value))
            index = diffArr.indexOf(Math.min(...diffArr))
        }
        return index
    }
    
    async getLeftRight(peakTimePosition:number,componentMz:number[]){
        let leftIdx=0
        let rightIdx =10000
        const peakTimeIndex = this.getIndex(this.scanTimes,peakTimePosition)
        for (let i = 0; i < componentMz.length; i++) {
            const mz = componentMz[i]
            const mzIdx = mz-this.mzArr[0]
            const ic = this.processAlignPeaks.map((peak)=>peak[mzIdx])
            const peakIdx=await this.localMax(ic)
            if(peakIdx.length===1){
                const leftIc = ic.filter((icVal,i)=>this.scanTimes[i]<peakTimePosition)
                const rightIc = ic.filter((icVal,i)=>this.scanTimes[i]>peakTimePosition)
                const maxPeakIntensity = ic[peakTimeIndex]
                for (let j = leftIc.length-1; j >0 ; j--) {
                    if( (leftIc[j]<maxPeakIntensity*this.minPeakIntensity && leftIc[j]<leftIc[j-1]) || leftIc[j]<1){
                        leftIdx=j
                        break
                    }
                }
                for (let j = 0; j < rightIc.length-1; j++) {
                    if((rightIc[j]<maxPeakIntensity*this.minPeakIntensity && rightIc[j]<rightIc[j+1]) || rightIc[j]<1 ){
                        rightIdx = j+peakTimeIndex
                        break
                    }
                }
                if(leftIdx!==0 && rightIdx!==10000){
                    return {leftIdx:leftIdx,rightIdx:rightIdx,referenceMz:mz}
                }

            }

        }

        for (let i = 0; i < componentMz.length; i++) {
            const mz = componentMz[i]
            const mzIdx = mz-this.mzArr[0]
            const ic = this.processAlignPeaks.map((peak)=>peak[mzIdx])
            const leftIc = ic.filter((icVal,i)=>this.scanTimes[i]<peakTimePosition)
            const rightIc = ic.filter((icVal,i)=>this.scanTimes[i]>peakTimePosition)
            const maxPeakIntensity = ic[peakTimeIndex]
                for (let j = leftIc.length-1; j >0 ; j--) {
                    if( (leftIc[j]<maxPeakIntensity*this.minPeakIntensity && leftIc[j]<leftIc[j-1]) || leftIc[j]<1){
                        leftIdx=j
                        break
                    }
                }
                for (let j = 0; j < rightIc.length-1; j++) {
                    if((rightIc[j]<maxPeakIntensity*this.minPeakIntensity && rightIc[j]<rightIc[j+1]) || rightIc[j]<1 ){
                        rightIdx = j + peakTimeIndex
                        break
                    }
                }

                if(leftIdx!=0 || rightIdx!=10000) {
                    return {leftIdx:leftIdx,rightIdx:rightIdx,referenceMz:mz}
                }

            }

    }

    async localMax(peakIntensitys:number[]): Promise<number[]>{
        const k =2
        let count = 0
        const arrLen = peakIntensitys.length
        let peakIndex:number[]=[]
        for (let i = 1; i < arrLen; i++) {
            if(peakIntensitys[i]-peakIntensitys[i-1]>0){
                count=count+1
            }
            else{
                if(count>=k) {
                    peakIndex.push(i - 1)
                }
                count=0
            }
        }
        return peakIndex
    }

}

module.exports=Decomposite