const {  buildAuthenticatedRouter,buildRouter } = require('admin-bro-expressjs');

// const adminRouter = (admin)=>{
//     const router =  buildAuthenticatedRouter(admin,{
//         authenticate: async (email, password) => {
//         const user = await User.findOne( {email: email})
//         if(! user || !user.isAdmin){
//             return  false
//         }
//         const isMatch = await  user.matchPassword(password)
//         if(!isMatch){
//             return false
//         }
//         return user
//         },
//         cookiePassword: 'some-secret-password-used-to-secure-cookie',  
//     })
//     return router
// }

const adminRouter = (admin)=>{
    const router = buildRouter(admin);
    return router;
}

module.exports = adminRouter