const { clearCache } = require('../services/queryCache')


module.exports = async (req , res , next) =>{
    await next();
    clearCache(req.user.id);
}