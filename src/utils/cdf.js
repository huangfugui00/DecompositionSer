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
const { readFileSync } = require('fs');
const { NetCDFReader } = require('netcdfjs');
const math = require('mathjs');
class Cdf {
    constructor(fileName) {
        this.mzLen = 0;
        this.minMz = 0;
        this.maxMz = 0;
        this.mzArr = [];
        this.scanTimes = [];
        this.tics = [];
        this.nMass = 0;
        this.massArr = [];
        this.intensityArr = [];
        this.alignPeaks = [];
        const file = readFileSync(fileName);
        this.cdfReader = new NetCDFReader(file);
    }
    readCDF() {
        return __awaiter(this, void 0, void 0, function* () {
            const mass_values = this.cdfReader.getDataVariable("mass_values");
            this.minMz = Math.floor(Math.min(...mass_values));
            this.maxMz = Math.floor(Math.max(...mass_values)) + 1;
            this.mzArr = new Array(this.maxMz - this.minMz + 1).fill(0).map((x, i) => i + this.minMz);
            this.mzLen = this.mzArr.length;
            this.tics = this.cdfReader.getDataVariable("total_intensity");
            this.scanTimes = this.cdfReader.getDataVariable('scan_acquisition_time');
            const scan_index = this.cdfReader.getDataVariable("scan_index");
            const intensity_values = this.cdfReader.getDataVariable("intensity_values");
            this.nMass = this.tics.length;
            yield this.prepareData(mass_values, scan_index, intensity_values);
            yield this.get3dZ();
        });
    }
    prepareData(mass_values, scan_index, intensity_values) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.nMass; i++) {
                if (i === this.nMass - 1) {
                    this.massArr.push(mass_values.slice(scan_index[i]));
                    this.intensityArr.push(intensity_values.slice(scan_index[i]));
                }
                else {
                    this.massArr.push(mass_values.slice(scan_index[i], scan_index[i + 1]));
                    this.intensityArr.push(intensity_values.slice(scan_index[i], scan_index[i + 1]));
                }
            }
        });
    }
    get3dZ() {
        return __awaiter(this, void 0, void 0, function* () {
            // 获得3d矩阵的z
            for (let i = 0; i < this.nMass; i++) {
                let singTimePeaks = new Array(this.mzLen).fill(0);
                const mass = this.massArr[i];
                const intensity = this.intensityArr[i];
                for (let j = 0; j < this.massArr[i].length; j++) {
                    const peakInd = Math.round(mass[j]) - this.minMz;
                    singTimePeaks[peakInd] = singTimePeaks[peakInd] < intensity[j] ? intensity[j] : singTimePeaks[peakInd];
                }
                if (singTimePeaks.length !== 121) {
                    console.log(singTimePeaks.length);
                }
                this.alignPeaks.push(singTimePeaks);
            }
        });
    }
}
module.exports = Cdf;
