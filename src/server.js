import fs from 'fs';
import path from 'path';
import { app, router } from './koaServer';
import LRU from 'lru-cache';
import send from 'koa-send';
import config from 'config';
// import convert from 'koa-convert';
import koaBodyparser from 'koa-bodyparser';
//import koaRouter from 'koa-router';

//middlewares
import authChecker from './middlewares/authChecker';
//routers
import auth from './routers/auth';
import ssr from './routers/ssr';


const resolve = file => path.resolve(__dirname, file);
const isProd = process.env.NODE_ENV === 'production';
const useMicroCache = process.env.MICRO_CACHE !== 'false';

function serveFile(url, fileName, maxAge = (1000 * 60 * 60 * 24)) {
    return async function(ctx, next) {
        if (ctx.url === url) {
            await send(ctx, fileName, {
                maxAge: maxAge
            });
        } else {
            await next();
        }
    };
}

function servePath(oldPath, path, maxAge = (1000 * 60 * 60 * 24)) {
    return async function(ctx, next) {
        if (ctx.url.indexOf(oldPath) == 0) {
            console.log(ctx.url.replace(oldPath, ''), path)
            await send(ctx, ctx.url.replace(oldPath, ''), {
                maxAge: maxAge,
                root: path
            });
        } else {
            await next();
        }
    };
}

app.use(koaBodyparser());

app.use(serveFile('/service-worker.js', './dist/service-worker.js'));
app.use(servePath('/dist', './dist'));
app.use(servePath('/public', './public'));
app.use(authChecker());
app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});


router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('*', ssr.routes(), ssr.allowedMethods());
app.use(router.routes(), router.allowedMethods());

app.listen(3000);
console.log("listen 3000");