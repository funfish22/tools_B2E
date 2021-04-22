const Router = require('koa-router');
const router = new Router();
const List = require('../../models/List');

const $ = require('cheerio');
const puppeteer = require('puppeteer');

router.get('/', async ctx => {
    await List.find()
    .then(lists => {
        ctx.status = 200;
        ctx.body = lists;
    })
    .catch(err => {
        ctx.status = 404;
        ctx.body = { notFound: '找不到任何東西' };
    });
});

router.post(
    '/add',
    async ctx => {

        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        // 開啟新分頁
        const page = await browser.newPage();
        // 進入指定頁面
        await page.goto(ctx.request.body.data);
        const html = await page.content();
        const books = $('#qrcode', html);
        let img = books.find('img').attr('src')
        browser.close();

        const newList = new List({
            data: img
        });

        console.log('books', books)

        await newList
        .save()
        .then(list => (ctx.body = list))
        .catch(err => (ctx.body = err));

        ctx.body = newList;
    }
);

router.delete('/delete',
    async ctx => {
        await List.remove().then(() => {
        ctx.status = 200;
        ctx.body = { success: true };
        });
    }
)

module.exports = router.routes();