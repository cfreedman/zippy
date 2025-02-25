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

class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWordEnd = false;
  }

  add(letter, _isLastLetter) {
    let newNode = new TrieNode();
    this.children.set(letter, newNode);

    newNode.isWordEnd = _isLastLetter;
    return newNode;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, node=this.root) {
    const wordLength = word.length;
    if (wordLength == 0) {
      return
    }

    let firstNode = node.children.get(word[0]);

    if (firstNode) {
      this.insert(word.slice(1), firstNode)
    } else {
      let newNode = node.add(word[0], length == 1);
      this.insert(word.slice(1), newNode);
    }
  }

  search(word, node=this.root) {
    if (word.length == 0) {
      return node.isWordEnd
    }

    if (!node.children.has(word[0])) {
      return false
    }

    return this.insert(word.slice(1), node.children.get(word[0]))
  }
}

class RouteNode {
  constructor() {
    this.children = new Map();
    this.handler = new Map();
    this.params = [];
  }
}

class TrieRouter {
  constructor() {
    this.root = new RouteNode();
  }

  #verifyParams(path, method, handler) {
    if (!path || typeof path !== "string" || path[0] !== "/") {
      throw new Error(`Incorrectly specified path ${path} - path should be string beginning with a slash mark`);
    }
    if (typeof handler !== "function") {
      throw new Error("Incorrectly specified handler function - it should be of function type")
    }
    if (!HTTP_METHODS[method]) {
      throw new Error("Invalid HTTP method supplied")
    }
  }

  #addRoute(path, method, handler) {
    this.#verifyParams(path, method, handler);

    let path = path.strip("/");
    const segments = path.split("/");
    let dynamicParams = [];

    if (segments.some((segment) => segment.includes(" "))) {
      throw new Error(`Incorrectly specified path ${path} - path should contain no whitespace`)
    }

    let currentNode = this.root;
    for (let segment of segments) {
      const isDynamic = segment[0] === ":";
      const key = isDynamic ? ":": segment;

      if (isDynamic) {
        dynamicParams.push(segment.slice(1));
      }

      if (!currentNode.children.has(key)) {
        let newNode = new RouteNode();
        currentNode.children.set(key, newNode);
      }

      currentNode = currentNode.children.get(segment);
    }

    currentNode.handler.set(method, handler);
    currentNode.params = dynamicParams;
  }

  findRoute(path, method) {
    const segments = path.strip("/").split("/");

    let currentNode = this.root;
    let extractedParams = [];

    for (let segment of segments) {
      if (!currentNode.children.has(segment)) {
        return null
      }

      currentNode = currentNode.children.get(segment)
    }

    return currentNode.handler.get(method);
  }

  printTree(node = this.root, indentation = 0) {
    const indent = "-".repeat(indentation);

    node.children.forEach((childNode, segment) => {
      console.log(`${indent}${segment}`);
      this.printTree(childNode, indentation + 1);
    });
  }

  get(path, handler) {
    this.#addRoute(path, HTTP_METHODS.GET, handler);
  }

  post(path, handler) {
    this.#addRoute(path, HTTP_METHODS.POST, handler);
  }

  put(path, handler) {
    this.#addRoute(path, HTTP_METHODS.PUT, handler);
  }

  patch(path, handler) {
    this.#addRoute(path, HTTP_METHODS.PATCH, handler);
  }

  head(path, handler) {
    this.#addRoute(path, HTTP_METHODS.HEAD, handler);
  }

  delete(path, handler) {
    this.#addRoute(path, HTTP_METHODS.DELETE, handler);
  }

  options(path, handler) {
    this.#addRoute(path, HTTP_METHODS.OPTIONS, handler);
  }

  trace(path, handler) {
    this.#addRoute(path, HTTP_METHODS.TRACE, handler);
  }

  connect(path, handler) {
    this.#addRoute(path, HTTP_METHODS.CONNECT, handle)
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