import { HTTP_METHODS } from "./constants";

class RouteNode {
  constructor() {
    this.children = new Map();
    this.handler = new Map();
    this.params = [];
  }
}

export class Router {
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
      let childNode = currentNode.children.get(segment);

      if (childNode) {
        currentNode = childNode;
      } else if (currentNode.children.has(":")) {
        extractedParams.push(segment);
        currentNode = currentNode.children.get(":");
      } else {
        return null;
      }
    }

    let params = new Object();

    for (let [param, value] of currentNode.params.map((param, index) => [param, extractedParams[index]])) {
      params[param] = value;
    }

    return {
      params,
      handler: currentNode.handler.get(method)
    }
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