"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const Utils = require('../utils/util');
const config = require('../config/config');
const process = require('child_process');
const mspPath = config.NIST.msp;
const nistExt = config.NIST.exe;
const filPath = config.NIST.fil;
const resultPath = config.NIST.result;
const readyPath = config.NIST.ready;
class NistCompare {
    constructor() {
        this.nComponent = 0;
        this.RTs = [];
    }
    generateFile(nistData) {
        return __awaiter(this, void 0, void 0, function* () {
            //peaklist生成tofanalysis.msp
            let nistListStr = '';
            const nComponent = nistData.length;
            this.nComponent = nComponent;
            for (let i = 0; i < nComponent; i++) {
                const nist = nistData[i];
                this.RTs.push(nist.scanTime);
                const nPeak = nist.peaklist.length;
                let peakListStr = '';
                for (let j = 0; j < nPeak; j++) {
                    peakListStr = peakListStr + '' + nist.peaklist[j].mz + ' ' + nist.peaklist[j].intensity + ';';
                }
                let nistStr = `name:Scan ${nist.scanTime}` + '\n' + `Num Peaks: ${nPeak}` + '\n' + peakListStr + '\n\n';
                nistListStr += nistStr;
            }
            if (fs.existsSync(mspPath)) {
                fs.unlinkSync(mspPath);
            }
            fs.writeFileSync(mspPath, nistListStr);
            //移动配置文件
            // @ts-ignore
            const rootPath = global.rootPath;
            fs.writeFileSync(filPath, fs.readFileSync(`${rootPath}\\src\\static\\nist\\gctofanalysis.fil`));
            // const moveConfigStr=`copy ${rootPath}\\src\\static\\nist\\gctofanalysis.fil ${filPath}`
            // process.execSync(moveConfigStr)
        });
    }
    execNist() {
        return __awaiter(this, void 0, void 0, function* () {
            // await zx`echo helloworld`
            if (fs.existsSync(readyPath)) {
                fs.unlinkSync(readyPath);
            }
            process.execSync(nistExt);
            while (true) {
                if (fs.existsSync(readyPath)) {
                    break;
                }
                yield Utils.sleep(1000);
            }
        });
    }
    resultToJson() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(resultPath)) {
                console.log('not exist SRESULT.TXT FILE');
                return null;
            }
            const result = fs.readFileSync(resultPath, 'utf-8');
            let resultJson = [];
            if (result) {
                const lines = result.split('\r\n');
                const lineNum = lines.length;
                let nCurrComponent = 0;
                let componentNistResult = { RT: this.RTs[nCurrComponent], nistResult: [] };
                for (let i = 0; i < lineNum; i++) {
                    const line = lines[i];
                    if (line.search('Unknown') === 0) {
                        if (componentNistResult.nistResult.length > 0) {
                            resultJson.push(componentNistResult);
                            console.log('push');
                        }
                        componentNistResult = { RT: this.RTs[nCurrComponent], nistResult: [] };
                        nCurrComponent++;
                        //新物质
                    }
                    else if (line.search('Hit') === 0) {
                        //新记录
                        let nistResult = {};
                        const lineSplits = line.split(';');
                        var patt = /<<(.+)>>/;
                        let result = patt.exec(lineSplits[0]);
                        if (result)
                            nistResult['name'] = result[1];
                        patt = /<<(.+)>>/;
                        result = patt.exec(lineSplits[1]);
                        if (result)
                            nistResult['formula'] = result[1];
                        result = lineSplits[2].split(': ');
                        if (result) {
                            nistResult['MF'] = parseInt(result[1]);
                        }
                        result = lineSplits[3].split(': ');
                        if (result) {
                            nistResult['RMF'] = parseInt(result[1]);
                        }
                        result = lineSplits[4].split(': ');
                        if (result) {
                            nistResult['pro'] = parseFloat(result[1]);
                        }
                        result = lineSplits[5].split(':');
                        if (result) {
                            nistResult['CAS'] = (result[1]);
                        }
                        componentNistResult['nistResult'].push(nistResult);
                    }
                    else {
                    }
                }
                if (componentNistResult.nistResult.length > 0) {
                    resultJson.push(componentNistResult);
                    console.log('push last');
                }
                return resultJson;
            }
            return null;
        });
    }
}
module.exports = NistCompare;
