import koa from 'koa';
import koaRouter from 'koa-router';
import mount from 'koa-mount';
import config from 'config';
import koaGrant from 'grant-koa';
import session from 'koa-session';
const app = new koa();
const router = koaRouter();

const grantConfig = config.get('grant');
const grant = new koaGrant(grantConfig);
app.keys = ['grant'];
app.use(session(app));
app.use(mount(grant));

export default { app, router };