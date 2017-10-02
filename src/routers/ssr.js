import fs from 'fs';
import path from 'path';
import { app } from '../koaServer';
import koaRouter from 'koa-router';
import LRU from 'lru-cache';
import { createBundleRenderer } from 'vue-server-renderer';
import auth from '../services/securityServ';
const isProd = process.env.NODE_ENV === 'production';
const useMicroCache = process.env.MICRO_CACHE !== 'false';
const router = koaRouter();

const resolve = file => path.resolve(__dirname, file);
const template = fs.readFileSync(resolve('../index.template.html'), 'utf-8');

let renderer;
let readyPromise;
// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
const microCache = LRU({
    max: 100,
    maxAge: 1000
})

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
const isCacheable = ctx => {
    //TODO customize logic
    useMicroCache;
}

function createRenderer(bundle, options) {
    // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
    return createBundleRenderer(bundle, Object.assign(options, {
        template,
        // for component caching
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        // this is only needed when vue-server-renderer is npm-linked
        basedir: resolve('./dist'),
        // recommended for performance
        runInNewContext: false
    }))
}
// wait readyPromise 
(async function() {
    if (isProd) {
        // In production: create server renderer using built server bundle.
        // The server bundle is generated by vue-ssr-webpack-plugin.
        const bundle = require('../../dist/vue-ssr-server-bundle.json')
            // The client manifests are optional, but it allows the renderer
            // to automatically infer preload/prefetch links and directly add <script>
            // tags for any async chunks used during render, avoiding waterfall requests.
        const clientManifest = require('../../dist/vue-ssr-client-manifest.json')
        renderer = createRenderer(bundle, {
            clientManifest
        })
    } else {
        // In development: setup the dev server with watch and hot-reload,
        // and create a new renderer on bundle / index template update.
        readyPromise = require('../../build/setup-dev-server')(app, (bundle, options) => {
            renderer = createRenderer(bundle, options)
        });
        await readyPromise;
    }
})()


router.get('/', async function(ctx, next) {
    ctx.set("Content-Type", "text/html");
    let reslove, reject;
    let userData;
    let promise = new Promise((r, rj) => {
        reslove = r;
        reject = rj;
    });

    const cacheable = isCacheable(ctx);
    if (cacheable) {
        const hit = microCache.get(ctx.url);
        if (hit) {
            if (!isProd) {
                console.log(`cache hit!`);
            }
            reslove(hit);
        }
    }
    let token = ctx.cookies.get("token");
    userData = token ? await auth.validRedisJWT(token) : '';
    const context = {
        title: 'Vue 2.0 SSR and KOA2', // default title
        url: ctx.url,
        userData
    }
    renderer.renderToString(context, (err, html) => {
        if (err) {
            reject(err)
        }
        if (cacheable) {
            microCache.set(ctx.url, html)
        }
        reslove(html);
    });
    await promise.then(function(html) {
        ctx.body = html;
    }, function(err) {
        if (err.url) {
            ctx.redirect(err.url)
        } else if (err.code === 404) {
            ctx.status = 404;
            ctx.body = '404 | Page Not Found';
        } else {
            // Render Error Page or Redirect
            ctx.status = 500;
            ctx.body = '500 | Internal Server Error';
            console.error(`error during render : ${ctx.url}`)
            console.error(err.stack)
        }
    });
});

router.post('/', async function(ctx, next) {
    ctx.set("Content-Type", "text/html");
    ctx.status = 404;
    ctx.body = '404 ';
    console.error(`error during render : ${ctx.url}`)
});

export default router;