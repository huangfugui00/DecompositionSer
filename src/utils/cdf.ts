const {readFileSync} = require('fs')
const {NetCDFReader} = require('netcdfjs')

class Cdf {
    cdfReader
    scanTimes:number[]=[]
    tics: number[] =[]
    nMass:number =0
    massArr:number[][]=[]
    intensityArr:number[][]=[]
    constructor(fileName:string) {
        const file = readFileSync(fileName)
        this.cdfReader = new NetCDFReader(file)
    }
    async readCDF(){
        const mass_values:number[]=this.cdfReader.getDataVariable("mass_values")
        this.tics = this.cdfReader.getDataVariable("total_intensity")
        this.scanTimes=this.cdfReader.getDataVariable('scan_acquisition_time')
        const scan_index:number[] = this.cdfReader.getDataVariable("scan_index")
        const intensity_values:number[] = this.cdfReader.getDataVariable("intensity_values")
        this.nMass = this.tics.length
        await  this.prepareData(mass_values,scan_index,intensity_values)
    }

    async prepareData(mass_values:number[], scan_index:number[], intensity_values:number[]){
        for (let i = 0; i < this.nMass; i++) {
            if(i===this.nMass-1){
                this.massArr.push(mass_values.slice(scan_index[i],))
                this.intensityArr.push(intensity_values.slice(scan_index[i],))
            }
            else {
                this.massArr.push(mass_values.slice(scan_index[i],scan_index[i+1]))
                this.intensityArr.push(intensity_values.slice(scan_index[i],scan_index[i+1]))
            }
        }
    }
}

module.exports=Cdf