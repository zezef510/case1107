import http from 'http';
import fs from 'fs';
import url from 'url';
import router from "./router/router.js";

let mimeTypes = {
    'jpg': 'images/jpg',
    'png': 'images/png',
    'js': 'text/javascript',
    'css': 'text/css',
    'svg': 'image/svg+xml',
    'ttf': 'font/ttf',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'eot': 'application/vnd.ms-fontobject'
}
const server = http.createServer((req, res) => {
    let urlPath = url.parse(req.url).pathname;
    const filesDefences = urlPath.match(/\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, {'Content-Type': extension});
        fs.createReadStream(process.cwd() + req.url).pipe(res)
    } else {
        let handle = router[urlPath];
        if (handle === undefined) {
            handle = router['/err'];
        }
        handle(req, res);
    }
});
server.listen('8080', () => {
    console.log('Đã kết nối')
})
