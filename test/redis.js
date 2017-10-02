import test from 'ava';
import { redisPool } from '../src/model';

test('test redis expire data', async t => {
    let data = {
        'id': 1,
        'name': 'Leo Yeh'
    }
    let redis = await redisPool.acquire();
    redis.setAsync(data.id.toString(), JSON.stringify(data), 'EX', 4);
    let value = await redis.getAsync(data.id.toString()).then(function(res) {
        return res ? JSON.parse(res) : {}
    });
    t.is(value.name, "Leo Yeh");
    redisPool.release(redis);


});

test('test redis  data', async t => {
    let data = {
        'id': 1,
        'name': 'Leo Yeh'
    }
    let redis = await redisPool.acquire();
    redis.setAsync(data.id.toString(), JSON.stringify(data), 'EX', 4);
    await new Promise(function(reslove, reject) {
        setTimeout(async function() {
            let value = await redis.getAsync(data.id.toString()).then(function(res) {
                return res ? JSON.parse(res) : {}
            });
            t.is(value.name, undefined);
            redisPool.release(redis);
            reslove();
        }, 5000);
    })


});