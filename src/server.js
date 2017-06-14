import fs from 'fs';
import path from 'path';
import { app, router } from './koaServer';
import LRU from 'lru-cache';
//import koaRouter from 'koa-router';

//routers
import ssr from './routers/ssr';


const resolve = file => path.resolve(__dirname, file);
const isProd = process.env.NODE_ENV === 'production';
const useMicroCache = process.env.MICRO_CACHE !== 'false';

//const app = new koa();
//const router = koaRouter();


app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});



router.use('*', ssr.routes(), ssr.allowedMethods());
app.use(router.routes(), router.allowedMethods());

app.listen(3000);
console.log("listen 3000");