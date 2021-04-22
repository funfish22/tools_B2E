const koa = require('koa');
const Router = require('koa-router');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new koa();
const router = new Router();

app.use(bodyParser());
app.use(cors());

const lists = require('./routes/api/lists');

router.get('/', async ctx => {
    ctx.body = { msg: 'Hello Koa Interfaces test' };
});

const db = require('./config/keys').mongoURI;

mongoose
    .connect(db,{ useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongodb Connectd...');
    })
    .catch(err => {
        console.log(err);
});

router.use('/api/lists', lists);

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on ${port}`);
});