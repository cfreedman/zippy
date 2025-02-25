import { createServer } from "node:http";

import { Router } from "./router";

const PORT = 5255;

export const run = (router, port) => {
  if (!router instanceof Router) {
    throw new Error("`router` argument must be an instance of Router");
  }

  if (typeof port !== "number") {
    throw new Error("`port` must be a number");
  }

  createServer((req, res) => {
    const route = router.findRoute(req.url, req.path);

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
  res.end;
});

const handleRequest = (req, res) => router.handleRequest(req, res);
const server = http.createServer(handleRequest);
server.listen(PORT);