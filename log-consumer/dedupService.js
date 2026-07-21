const generateHash = require('../parser/utils/hash');
const {client} = require('./redisClient');

const checkDuplicate=async(log)=>{
    const hash = generateHash(log);
    const exists = await client.exists(hash);
    
    if(exists){
        await client.incr(`${hash}:count`);
        return {
        isDuplicate: true,
        fingerprint: hash,
        };
    }
    
    await client.set(hash, "seen", { ex: 3600 });

    await client.set(`${hash}:count`, 1, { ex: 3600 });

    return {
        isDuplicate: false,
        fingerprint: hash,
    };
}

module.exports = checkDuplicate;