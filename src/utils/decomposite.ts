class Decomposite{
    mzLen:number=0
    timeLen:number=0
    mzArr:number[]=[]
    scanTimes:number[]=[]
    alignPeaks:number[][]=[]
    processAlignPeaks:number[][]=[]//处理后的alignPeaks
    minPeakIntensity:number = 0.02

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
            let peakIndex = new Array(this.mzLen).fill(0).map((x,i)=>i)
            peakIndex = peakIndex.sort((a,b)=>peakMz[a]>peakMz[b]?1:-1)
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
        for (let i = 1; i < nPeak; i++) {
            if(Math.abs(peakTime[i]-tempPeakTime[tempPeakTime.length-1])){
                tempPeakTime.push(peakTime[i])
                tempPeakMz.push(peakMz[i])
            }
            else{

                const peakTimePosition=tempPeakTime.reduce( (a,b)=>a+b,0)/tempPeakTime.length
                const componentMz = tempPeakMz.sort()
                const result = await this.getLeftRight(peakTimePosition,componentMz)
                if(!result){
                    throw  Error('left right Err')
                }
                await this.getEstCurve(peakTimePosition,componentMz,result.leftIdx,result.rightIdx,result.referenceMz)


            }
        }
    }

    async getEstCurve(peakTimePosition:number,componentMz:number[],leftIdx:number,rightIdx:number,referenceMz:number){
        let estCurve:number[]=new Array(this.mzLen).fill(0)
        this.processAlignPeaks[referenceMz].slice(leftIdx,rightIdx)
        for (let i = 0; i < componentMz.length; i++) {


        }

    }
    
    async getLeftRight(peakTimePosition:number,componentMz:number[]){
        let leftIdx=0
        let rightIdx =10000
        for (let i = 0; i < componentMz.length; i++) {
            const mz = componentMz[i]
            const mzIdx = mz-this.mzArr[0]
            const ic = this.processAlignPeaks.map((peak)=>peak[mzIdx])
            const peakIdx=await this.localMax(ic)
            if(peakIdx.length===1){
                const leftIc = ic.filter((icVal,i)=>this.scanTimes[i]<peakTimePosition)
                const rightIc = ic.filter((icVal,i)=>this.scanTimes[i]>peakTimePosition)
                const maxPeakIntensity = ic[peakTimePosition]
                for (let j = leftIc.length-1; j >0 ; j--) {
                    if( (leftIc[j]<maxPeakIntensity*this.minPeakIntensity && leftIc[j]<leftIc[j-1]) || leftIc[j]<1){
                        leftIdx=j
                        break
                    }
                }
                for (let j = 0; j < rightIc.length-1; j++) {
                    if((rightIc[j]<maxPeakIntensity*this.minPeakIntensity && rightIc[j]<rightIc[j+1]) || rightIc[j]<1 ){
                        rightIdx = j
                        break
                    }
                }

            }

        }
        if(leftIdx===0 || rightIdx===10000){
            for (let i = 0; i < componentMz.length; i++) {
                const mz = componentMz[i]
                const mzIdx = mz-this.mzArr[0]
                const ic = this.processAlignPeaks.map((peak)=>peak[mzIdx])
                const leftIc = ic.filter((icVal,i)=>this.scanTimes[i]<peakTimePosition)
                const rightIc = ic.filter((icVal,i)=>this.scanTimes[i]>peakTimePosition)
                const maxPeakIntensity = ic[peakTimePosition]
                    for (let j = leftIc.length-1; j >0 ; j--) {
                        if( (leftIc[j]<maxPeakIntensity*this.minPeakIntensity && leftIc[j]<leftIc[j-1]) || leftIc[j]<1){
                            leftIdx=j
                            break
                        }
                    }
                    for (let j = 0; j < rightIc.length-1; j++) {
                        if((rightIc[j]<maxPeakIntensity*this.minPeakIntensity && rightIc[j]<rightIc[j+1]) || rightIc[j]<1 ){
                            rightIdx = j
                            break
                        }
                    }
                    if(leftIdx!=0 || rightIdx!=10000) {
                        return {leftIdx:leftIdx,rightIdx:rightIdx,referenceMz:mz}
                    }

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