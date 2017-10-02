import test from 'ava';
import model from '../src/model';
import CryptoJS from "crypto-js";


test.before(async t => {
    //await model.company.sync({ force: true });
    await model.user.sync({ force: true });
});


// test('test insert company1', async t => {
//     var company1 = await model.company.create({
//         'name': '\'',
//         'marchantId': 'xxxxxx',
//         'hashKey': '8KKZaPB2LEDYEldYrQVOxht6qTbr1zh9',
//         'hashIv': 'j19uQKwCpaA3vN1X'
//     });
//     t.is(company1.get('name'), '\'');
// });

// test('test insert company2', async t => {
//     // Table created
//     var company2 = await model.company.create({
//         'name': 'testCompany',
//         'marchantId': 'MS3685697',
//         'hashKey': '8KKZaPB2LEDYEldYrQVOxht6qTbr1zh9',
//         'hashIv': 'j19uQKwCpaA3vN1X'
//     });
//     t.is(company2.get('name'), 'testCompany');
//     t.is(company2.get('marchantId'), 'MS3685697');

// });


test('test insert user1', async t => {
    // Table created
    var user = await model.user.create({
        'name': 'UserName1',
        'email': 'ccc@cc.cc',
        'token': CryptoJS.SHA256("password").toString(CryptoJS.enc.Hex),
        'type': 0
    });
    t.is(user.get('name'), 'UserName1');
    t.is(user.get('email'), 'ccc@cc.cc');
});