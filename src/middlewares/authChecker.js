import auth from '../services/securityServ';

export default function(settings) {

    var s = Object.assign({
        ignoreUrl: /.*/, // regular 
        loginUrl: '/login'
    }, settings || {});

    return async(ctx, next) => {
        if (/(\/auth)?\/login/.test(ctx.request.url)) {
            await next();
            return;
        }
        let token, verify = false;
        let decoded, msg;
        let isAjax = !!ctx.request.header['x-requested-with'];
        if (!isAjax && ctx.request.method == "GET") {
            token = ctx.cookies.get("token");
        } else {
            token = ctx.request.header['authorization']
        }
        if (token) {
            try {
                decoded = await auth.validRedisJWT(token);
                ctx.userData = decoded;
                verify = true;
            } catch (err) {
                msg = err.message;
                console.error("auth", err.message);
                switch (err.message) {
                    case "jwt expired":
                        //todo
                        break;

                }
            }
        }
        if (verify) {
            await next();
        } else {
            if (isAjax) {
                ctx.body = {
                    status: 401,
                    message: msg
                }
                ctx.status = 401;
            } else {
                ctx.redirect(s.loginUrl);
            }
        }


    };
}