const {  buildAuthenticatedRouter,buildRouter } = require('admin-bro-expressjs');



const adminRouter = (admin)=>{
    const router = buildRouter(admin);
    return router;
}

module.exports = adminRouter