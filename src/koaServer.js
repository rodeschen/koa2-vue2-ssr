import koa from 'koa';
import koaRouter from 'koa-router';

const app = new koa();
const router = koaRouter();

export default { app, router };