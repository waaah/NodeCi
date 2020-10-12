const mongoose = require('mongoose');
const redis = require('redis');
const keys = require('../config/keys');
const client = redis.createClient(keys.redisUrl);
const util = require('util')
client.get = util.promisify(client.get);
client.hget = util.promisify(client.hget);
client.hset = util.promisify(client.hset);


const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.exec = async function(){
    if(!this.useCache){
        return exec.apply(this, arguments);
    }
    const key = JSON.stringify(Object.assign({}, this.getQuery() , {
        collection : this.mongooseCollection.name
    }));
    const cacheValue = await client.hget( this.hashKey , key);
    if(cacheValue){
        const doc =  JSON.parse(cacheValue)
        return Array.isArray(doc) ? doc.map(d=> new this.model(d)) : new this.model(doc);
       
    }
    const result = await exec.apply(this , arguments);
    client.hset(this.hashKey , key , JSON.stringify(result));
    client.expire(this.hashKey , 10);
    return result;
}

mongoose.Query.prototype.cache = function(options = {} ){
    console.log(options)
    this.hashKey = JSON.stringify(options.key || '');
    this.useCache = true;
    return this;
}

module.exports = {
    clearCache(hashKey){
        client.del(JSON.stringify(hashKey))
    }
}