const http = require("node:http");

const PORT = 5255;

const baseHeader = {
  "Content-Type": "text/plain",
};

const routeHandlers = {
  "GET /": () => ({ statusCode: 200, data: "Hello World!", headers: { "My-Header": "Hello World!" } }),
  "POST /echo": () => ({ statusCode: 201, data: "Yellow World!", headers: { "My-Header": "Yellow World!"} }),
};

const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  TRACE: "TRACE",
  OPTIONS: "OPTIONS",
  CONNECT: "CONNECT",
};

class Router {
  constructor() {
    this.routes = {};
  }

  #addRoute(method, path, handler) {
    this.routes[`${method} ${path}`] = handler; 
  }

  get(path, handler) {
    this.#addRoute(HTTP_METHODS.GET, path, handler);
  }

  post(path, handler) {
    this.#addRoute(HTTP_METHODS.POST, path, handler);
  }

  put(path, handler) {
    this.#addRoute(HTTP_METHODS.PUT, path, handler);
  }

  patch(path, handler) {
    this.#addRoute(HTTP_METHODS.PATCH, path, handler);
  }

  head(path, handler) {
    this.#addRoute(HTTP_METHODS.HEAD, path, handler);
  }

  delete(path, handler) {
    this.#addRoute(HTTP_METHODS.DELETE, path, handler);
  }

  options(path, handler) {
    this.#addRoute(HTTP_METHODS.OPTIONS, path, handler);
  }

  trace(path, handler) {
    this.#addRoute(HTTP_METHODS.TRACE, path, handler);
  }

  connect(path, handler) {
    this.#addRoute(HTTP_METHODS.CONNECT, path, handler);
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