import koaRouter from 'koa-router';
import querystring from 'querystring';
import axios from '../services/axios';
import auth from '../services/securityServ';
import CryptoJS from "crypto-js";
import { model, redis } from '../model';
import jwt from 'jsonwebtoken';

import config from 'config';



const jwtSetting = config.get('jwt');
//import jwtSetting from '../configs/jwt';


const router = koaRouter();




router.get('/facebook_callback', async function(ctx, next) {
    let facebookURI = 'https://graph.facebook.com/10212840635484664?fields=id,name,picture,email&access_token=' + ctx.query.access_token;
    await axios.get(facebookURI).then(function(response) {
        ctx.body = response.data;
    });




});

router.get('/google_callback', async function(ctx, next) {
    let googleURI = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + ctx.query.access_token;
    await axios.get(googleURI).then(function(response) {
        ctx.body = response.data;
    });

});

router.post('/login', async function(ctx, next) {
    let data = ctx.request.body;
    let user = await auth.validUser(data);
    let token = await auth.getRedisJWT({ userName: user.name }, {
        pppp: 'tttt' // server only data
    });
    ctx.cookies.set("token", token, { httpOnly: true, maxAge: jwtSetting.expiresIn });
    ctx.body = { userName: user.name, token };
});

export default router;