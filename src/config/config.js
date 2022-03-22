const path = require('path');
const static='./static'
const NIST = 'C:\\NIST17\\MSSEARCH\\'
module.exports = {
    DIR : {
      thumb: `${static}/thumb`,
      imgs: `${static}/imgs`,
      avatar:`${static}/avatar`,
    },
    SQL : {
      url: "mongodb://localhost:27017/ecom"
    },
    JWT : {
      secret:"mxhdxdsn12mxs9",
      expire_day:1
    },
    NIST:{
        fil:`${NIST}gctofanalysis.fil`,
        msp:`${NIST}tofanalysis.msp`,
        exe:`${NIST}nistms.exe /INSTRUMENT /PAR=2`,
        result:`${NIST}SRCRESLT.TXT`
    }
  };