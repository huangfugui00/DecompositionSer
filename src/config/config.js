const path = require('path');
const static='./static'

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
    }
  };