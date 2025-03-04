import { createServer } from "node:http";

import { IncomingRequest, Router } from "./router.js";
import { HTTPMethod } from "./constants.js";

const PORT = 5255;

export const run = (router: Router, port: number) => {

  createServer((req, res) => {
    if (!req.method) {
      res.writeHead(404, { "Content-Length": 9 });
      res.end("Not Found");
      return
    }

    const route = router.findRoute(req.url ?? "/", req.method as HTTPMethod);

    if (route?.handler) {
      const reqWithParams: IncomingRequest = req;
      reqWithParams.params = route.params
      reqWithParams.queryParams = route.queryParams;
      route.handler(reqWithParams, res);
    } else {
      res.writeHead(404, { "Content-Length": 9 });
      res.end("Not Found");
    }
  }).listen(port);  
}

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

const router = new Router();
run(router, PORT);