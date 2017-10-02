import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import Redis from 'redis';
import genericPool from 'generic-pool';
import Bluebird from 'bluebird';

import config from 'config';
Bluebird.promisifyAll(Redis.RedisClient.prototype);
Bluebird.promisifyAll(Redis.Multi.prototype);






let dbConfig = config.get('dbconfig');

let db = {};
var sequelize = new Sequelize(
    dbConfig.dbName,
    dbConfig.userName,
    dbConfig.password, {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        pool: dbConfig.pool
    });

fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
export const model = db;

let redisConfig = config.get('redis');
let host = redisConfig.host;
let port = redisConfig.port;
let _redisPool = genericPool.createPool({
    create: function() {
        return new Promise(function(resolve, reject) {
            let client = Redis.createClient(port, host);
            client.on("connect", function() {
                resolve(client);
            })
            client.on("error", function(err) {
                console.log(err);
            });
        })
    },
    destroy: function(client) {
        return new Promise(function(client) {
            client.on('end', function() {
                resolve();
            })
            client.quit();
        })
    }
}, {
    max: redisConfig.pool.max,
    min: redisConfig.pool.min,
    acquireTimeoutMillis: redisConfig.pool.idle,
    fifo: true,
});



export const redisPool = _redisPool;