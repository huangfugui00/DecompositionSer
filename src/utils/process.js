"use strict";
const smooth = require('array-smooth');
class Process {
    constructor() {
    }
    avgSmooth(y, windowSize = 2) {
        return smooth(y, windowSize);
    }
}
module.exports = Process;
