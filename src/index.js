const http = require("node:http");

const PORT = 5255;

const baseHeader = {
  "Content-Type": "text/plain",
};

const routeHandlers = {
  "GET /": () => ({ statusCode: 200, data: "Hello World!", headers: { "My-Header": "Hello World!" } }),
  "POST /echo": () => ({ statusCode: 201, data: "Yellow World!", headers: { "My-Header": "Yellow World!"} }),
};

class Router {
  constructor() {
    this.routes = {};
  }

  addRoute(method, path, handler) {
    this.routes[`${method} ${path}`] = handler; 
  }

  printRoutes() {
    console.log(Object.entries(this.routes))
  }

  handleRequest(request, response) {
    const { url, method } = request;
    const handler = this.routes[`${method} ${url}`];
    
    if (!handler) {
      console.log("404 Not Found");
      response.writeHead(404, { "Content-Type": "text/plain" })
      return response.end("Not found");
    }

    handler(request, response)
  }
}

const router = new Router();
router.addRoute('GET', '/', function handleGetBasePath(req, res) { 
  console.log("Hello from GET /"); 
  res.end();
});
router.addRoute('POST', '/', function handlePostBasePath(req, res) { 
  console.log("Hello from POST /");
  res.end;
});

const handleRequest = (req, res) => router.handleRequest(req, res);
const server = http.createServer(handleRequest);
server.listen(PORT);