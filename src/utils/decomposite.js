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
const Process = require('./process');
class Decomposite {
    constructor(mzArr, scanTimes, alignPeaks) {
        this.mzLen = 0;
        this.timeLen = 0;
        this.mzArr = [];
        this.scanTimes = [];
        this.alignPeaks = [];
        this.processAlignPeaks = []; //处理后的alignPeaks
        this.minPeakIntensity = 0.02;
        this.estList = [];
        this.mzArr = mzArr;
        this.scanTimes = scanTimes;
        this.alignPeaks = alignPeaks;
        this.mzLen = mzArr.length;
        this.timeLen = scanTimes.length;
    }
    isMatrix(arr2) {
        const lengths = arr2.map((arr) => arr.length);
        if (Math.max(...lengths) === Math.min(...lengths)) {
            return true;
        }
        return false;
    }
    decomposite() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isMatrix(this.alignPeaks)) {
                    throw Error('alignPeaks is not a matrix');
                }
                //扣背景.每个质量轴先把最小值扣掉
                const minValues = this.mzArr.map((mz, i) => Math.min(...this.alignPeaks.map((alignpeak) => alignpeak[i])));
                minValues.forEach((minValue, i) => this.scanTimes.map((scanTimes, j) => this.alignPeaks[j][i] -= minValue));
                // this.alignPeaks = this.alignPeaks.map((alignPeak)=>alignPeak.map(x=>x-Math.min(...alignPeak)))
                const maxPeakIntenity = Math.max(...this.alignPeaks.map((alignPeaks) => Math.max(...alignPeaks)));
                this.processAlignPeaks = this.alignPeaks.map((alignPeak) => alignPeak.map((peakIntensity) => peakIntensity > this.minPeakIntensity * maxPeakIntenity ? peakIntensity : 0));
                //寻峰
                let peakMz = [];
                let peakTime = [];
                for (let i = 0; i < this.mzLen; i++) {
                    const mzPeakIntensitys = this.processAlignPeaks.map((alignPeak) => alignPeak[i]);
                    const peakIndex = yield this.localMax(mzPeakIntensitys);
                    if (peakIndex.length > 0) {
                        peakMz.push(...new Array(peakIndex.length).fill(this.mzArr[i]));
                        peakTime.push(...peakIndex.map((index) => this.scanTimes[index]));
                    }
                }
                let peakIndex = new Array(peakTime.length).fill(0).map((x, i) => i);
                peakIndex = peakIndex.sort((a, b) => peakTime[a] > peakTime[b] ? 1 : -1);
                peakMz = peakIndex.map((index) => peakMz[index]);
                peakTime = peakIndex.map((index) => peakTime[index]);
                //获取est
                yield this.getEst(peakMz, peakTime);
            }
            catch (err) {
                throw Error(err);
            }
        });
    }
    getEst(peakMz, peakTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const nPeak = peakMz.length;
            let tempPeakTime = [];
            let tempPeakMz = [];
            tempPeakTime[0] = peakTime[0];
            tempPeakMz[0] = peakMz[0];
            const interVal = this.scanTimes[3] - this.scanTimes[0];
            for (let i = 1; i < nPeak; i++) {
                if (Math.abs(peakTime[i] - tempPeakTime[tempPeakTime.length - 1]) < interVal) {
                    tempPeakTime.push(peakTime[i]);
                    tempPeakMz.push(peakMz[i]);
                }
                else if (tempPeakMz.length >= 3) {
                    let est = {};
                    const peakTimePosition = tempPeakTime.reduce((a, b) => a + b, 0) / tempPeakTime.length;
                    const peakTimeIndex = this.getIndex(this.scanTimes, peakTimePosition);
                    const componentMz = tempPeakMz.sort();
                    const result = yield this.getLeftRight(peakTimePosition, componentMz);
                    if (!result) {
                        throw Error('left right Err');
                    }
                    let estMassSpectrum = yield this.getEstMassSpectrum(peakTimeIndex, componentMz);
                    let estCurve = yield this.getEstCurve(peakTimeIndex, componentMz, result.leftIdx, result.rightIdx, result.referenceMz);
                    const process = new Process();
                    estCurve = process.avgSmooth(estCurve, 3);
                    est['massSpectrum'] = { x: this.mzArr, y: estMassSpectrum };
                    est['curve'] = { y: estCurve, x: this.scanTimes };
                    est['componentMz'] = componentMz;
                    est['peakTimePostion'] = peakTimePosition;
                    est['peakTimeIndex'] = peakTimeIndex;
                    this.estList.push(est);
                    tempPeakTime = [];
                    tempPeakMz = [];
                    tempPeakTime[0] = peakTime[i];
                    tempPeakMz[0] = peakMz[i];
                }
                else {
                    tempPeakTime = [];
                    tempPeakMz = [];
                    tempPeakTime[0] = peakTime[i];
                    tempPeakMz[0] = peakMz[i];
                }
            }
            if (tempPeakMz.length >= 3) {
                let est = {};
                const peakTimePosition = tempPeakTime.reduce((a, b) => a + b, 0) / tempPeakTime.length;
                const peakTimeIndex = this.getIndex(this.scanTimes, peakTimePosition);
                const componentMz = tempPeakMz.sort();
                const result = yield this.getLeftRight(peakTimePosition, componentMz);
                if (!result) {
                    throw Error('left right Err');
                }
                const estCurve = yield this.getEstCurve(peakTimeIndex, componentMz, result.leftIdx, result.rightIdx, result.referenceMz);
                let estMassSpectrum = yield this.getEstMassSpectrum(peakTimeIndex, componentMz);
                est['massSpectrum'] = { x: this.mzArr, y: estMassSpectrum };
                est['curve'] = { y: estCurve, x: this.scanTimes };
                est['componentMz'] = componentMz;
                est['peakTimePostion'] = peakTimePosition;
                est['peakTimeIndex'] = peakTimeIndex;
                this.estList.push(est);
                tempPeakTime = [];
                tempPeakMz = [];
            }
        });
    }
    getEstMassSpectrum(peakTimeIndex, componentMz) {
        return __awaiter(this, void 0, void 0, function* () {
            let massSpectrum = new Array(this.mzLen).fill(0);
            for (let i = 0; i < this.mzLen; i++) {
                const mz = i + this.mzArr[0];
                const minIntensity = Math.min(...componentMz.map((mz) => this.alignPeaks[peakTimeIndex][mz - this.mzArr[0]]));
                if (componentMz.includes(mz)) {
                    massSpectrum[i] = this.alignPeaks[peakTimeIndex][i];
                }
                else {
                    massSpectrum[i] = this.alignPeaks[peakTimeIndex][i] < minIntensity ? this.alignPeaks[peakTimeIndex][i] : 0;
                }
            }
            const maxIntensity = Math.max(...massSpectrum);
            massSpectrum.forEach((_, i) => massSpectrum[i] = massSpectrum[i] / maxIntensity);
            return massSpectrum;
        });
    }
    getEstCurve(peakTimeIndex, componentMz, leftIdx, rightIdx, referenceMz) {
        return __awaiter(this, void 0, void 0, function* () {
            const referenceMzIndex = referenceMz - this.mzArr[0];
            let estCurve = new Array(this.timeLen).fill(0);
            for (let i = leftIdx; i < rightIdx; i++) {
                estCurve[i] = this.alignPeaks[i][referenceMzIndex];
            }
            for (let i = 0; i < componentMz.length; i++) {
                let leftBreak = leftIdx;
                let rightBreak = rightIdx;
                if (referenceMz !== componentMz[i]) {
                    const mz = componentMz[i];
                    const mzIndex = mz - this.mzArr[0];
                    const rate = this.alignPeaks[peakTimeIndex][mzIndex] / this.alignPeaks[peakTimeIndex][referenceMzIndex];
                    let count = 0;
                    //计算左侧的起始点
                    for (let j = peakTimeIndex; j > leftIdx; j--) {
                        if (count > 1) {
                            leftBreak = j;
                            break;
                        }
                        const currRate = this.alignPeaks[j][mzIndex] / this.alignPeaks[j][referenceMzIndex];
                        if (currRate / rate > 3) {
                            count = count + 1;
                        }
                    }
                    //est 累加
                    for (let j = leftIdx; j < leftBreak; j++) {
                        estCurve[j] += this.alignPeaks[j][referenceMzIndex] * rate;
                    }
                    for (let j = leftBreak; j < peakTimeIndex; j++) {
                        estCurve[j] += this.alignPeaks[j][mzIndex];
                    }
                    //计算右侧的终止点
                    for (let j = peakTimeIndex; j < rightIdx; j++) {
                        if (count > 1) {
                            rightBreak = j;
                            break;
                        }
                        const currRate = this.alignPeaks[j][mzIndex] / this.alignPeaks[j][referenceMzIndex];
                        if (currRate / rate > 3) {
                            count = count + 1;
                        }
                    }
                    for (let j = peakTimeIndex; j < rightBreak; j++) {
                        estCurve[j] += this.alignPeaks[j][mzIndex];
                    }
                    for (let j = rightBreak; j < rightIdx; j++) {
                        estCurve[j] += this.alignPeaks[j][referenceMzIndex] * rate;
                    }
                }
            }
            return estCurve;
        });
    }
    getIndex(arr, value) {
        let index = arr.indexOf(value);
        if (index === -1) {
            const diffArr = arr.map((x) => Math.abs(x - value));
            index = diffArr.indexOf(Math.min(...diffArr));
        }
        return index;
    }
    getLeftRight(peakTimePosition, componentMz) {
        return __awaiter(this, void 0, void 0, function* () {
            let leftIdx = 0;
            let rightIdx = 10000;
            const peakTimeIndex = this.getIndex(this.scanTimes, peakTimePosition);
            for (let i = 0; i < componentMz.length; i++) {
                const mz = componentMz[i];
                const mzIdx = mz - this.mzArr[0];
                let ic = this.alignPeaks.map((peak) => peak[mzIdx]);
                ic = ic.map((intensity) => intensity > Math.max(...ic) * this.minPeakIntensity ? intensity : 0);
                const peakIdx = yield this.localMax(ic);
                if (peakIdx.length === 1) {
                    const leftIc = ic.filter((icVal, i) => this.scanTimes[i] < peakTimePosition);
                    const rightIc = ic.filter((icVal, i) => this.scanTimes[i] > peakTimePosition);
                    const maxPeakIntensity = ic[peakTimeIndex];
                    for (let j = leftIc.length - 1; j > 0; j--) {
                        if ((leftIc[j] < maxPeakIntensity * this.minPeakIntensity && leftIc[j] < leftIc[j - 1]) || leftIc[j] < 1) {
                            leftIdx = j;
                            break;
                        }
                    }
                    for (let j = 0; j < rightIc.length - 1; j++) {
                        if ((rightIc[j] < maxPeakIntensity * this.minPeakIntensity && rightIc[j] < rightIc[j + 1]) || rightIc[j] < 1) {
                            rightIdx = j + peakTimeIndex;
                            break;
                        }
                    }
                    if (leftIdx !== 0 && rightIdx !== 10000) {
                        return { leftIdx: leftIdx, rightIdx: rightIdx, referenceMz: mz };
                    }
                }
            }
            for (let i = 0; i < componentMz.length; i++) {
                const mz = componentMz[i];
                const mzIdx = mz - this.mzArr[0];
                const ic = this.alignPeaks.map((peak) => peak[mzIdx]);
                const leftIc = ic.filter((icVal, i) => this.scanTimes[i] < peakTimePosition);
                const rightIc = ic.filter((icVal, i) => this.scanTimes[i] > peakTimePosition);
                const maxPeakIntensity = ic[peakTimeIndex];
                for (let j = leftIc.length - 1; j > 0; j--) {
                    if ((leftIc[j] < maxPeakIntensity * this.minPeakIntensity && leftIc[j] < leftIc[j - 1]) || leftIc[j] < 1) {
                        leftIdx = j;
                        break;
                    }
                }
                for (let j = 0; j < rightIc.length - 1; j++) {
                    if ((rightIc[j] < maxPeakIntensity * this.minPeakIntensity && rightIc[j] < rightIc[j + 1]) || rightIc[j] < 1) {
                        rightIdx = j + peakTimeIndex;
                        break;
                    }
                }
                if (leftIdx != 0 || rightIdx != 10000) {
                    return { leftIdx: leftIdx, rightIdx: rightIdx, referenceMz: mz };
                }
            }
        });
    }
    localMax(peakIntensitys) {
        return __awaiter(this, void 0, void 0, function* () {
            const k = 5;
            let count = 0;
            const arrLen = peakIntensitys.length;
            let peakIndex = [];
            for (let i = 1; i < arrLen; i++) {
                if (peakIntensitys[i] - peakIntensitys[i - 1] > 0) {
                    count = count + 1;
                }
                else {
                    if (count >= k) {
                        peakIndex.push(i - 1);
                    }
                    count = 0;
                }
            }
            return peakIndex;
        });
    }
}
module.exports = Decomposite;
