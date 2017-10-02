import { model, redisPool } from '../model';
import CryptoJS from "crypto-js";
import jwt from 'jsonwebtoken';
import uuidv5 from 'uuid/v5'

import config from 'config';

const jwtSetting = config.get('jwt');

export default {

    async validUser({ email, password }) {
        let user = await model.user.findOne({
            where: {
                'email': email
            }
        });

        if (user) {
            let sha256PWD = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
            if (user.token != sha256PWD) {
                throw "password error";
            }
            return user;
        } else {
            throw "user error";
        }
    },

    async getRedisJWT(tokenData = {}, sessionData = {}) {
        let uuid = uuidv5('http://testcom', uuidv5.URL);
        let jwtData = Object.assign({
            id: uuid
        }, tokenData);

        let token = jwt.sign(jwtData, jwtSetting.secertKey, { expiresIn: jwtSetting.expiresIn });

        let redisData = Object.assign({}, jwtData, { token, sessionData });

        let redis = await redisPool.acquire();
        await redis.setAsync(uuid, JSON.stringify(redisData), 'EX', jwtSetting.expiresIn);
        redisPool.release(redis);
        return token;
    },

    async validRedisJWT(token) {
        let decoded;
        try {
            decoded = jwt.verify(token, jwtSetting.secertKey);
        } catch (err) {
            var msg = err.message;
            switch (err.message) {
                case "jwt expired":
                    //todo
                    break;

            }
            throw err;
        }
        let redis = await redisPool.acquire();
        let redisData = await redis.getAsync(decoded.id).then(function(res) {
            redisPool.release(redis);
            return res ? JSON.parse(res) : {};
        });
        if (redisData) {
            return redisData;
        } else {
            throw "redis not found";
        }
    }

}