import { createServer } from "node:http";

import { Router } from "./router.ts";

const PORT = 5255;

export const run = (router: Router, port: number) => {

  createServer((req, res) => {
    const route = router.findRoute(req.url, req.method?);

    if (route?.handler) {
      req.params = route.params;
      route.handler(req, res);
    } else {
      res.writeHead(404, null, { "Content-Length": 9 });
      res.end("Not Found");
    }
  }).listen(port);  
}

const router = new Router();
router.get("/", function handleGetBasePath(req, res) { 
  console.log("Hello from GET /"); 
  res.end();
});
router.post("/", function handlePostBasePath(req, res) { 
  console.log("Hello from POST /");
  res.end();
});

const handleRequest = (req, res) => router.handleRequest(req, res);
const server = http.createServer(handleRequest);
server.listen(PORT);