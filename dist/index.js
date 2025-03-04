"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const node_http_1 = require("node:http");
const router_js_1 = require("./router.js");
const PORT = 5255;
const run = (router, port) => {
    (0, node_http_1.createServer)((req, res) => {
        if (!req.method) {
            res.writeHead(404, { "Content-Length": 9 });
            res.end("Not Found");
            return;
        }
        const route = router.findRoute(req.url ?? "/", req.method);
        if (route?.handler) {
            const reqWithParams = req;
            reqWithParams.params = route.params;
            reqWithParams.queryParams = route.queryParams;
            route.handler(reqWithParams, res);
        }
        else {
            res.writeHead(404, { "Content-Length": 9 });
            res.end("Not Found");
        }
    }).listen(port);
};
exports.run = run;
// const router = new Router();
// router.get("/", function handleGetBasePath(req, res) {
//   console.log("Hello from GET /");
//   res.end();
// });
// router.post("/", function handlePostBasePath(req, res) {
//   console.log("Hello from POST /");
//   res.end();
// });
// const server = http.createServer(handleRequest);
// server.listen(PORT);
const router = new router_js_1.Router();
(0, exports.run)(router, PORT);
//# sourceMappingURL=index.js.map