"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const url_1 = require("url");
const constants_js_1 = require("./constants.js");
class RouteNode {
    children;
    handler;
    params;
    constructor() {
        this.children = new Map();
        this.handler = new Map();
        this.params = [];
    }
}
class Router {
    root;
    constructor() {
        this.root = new RouteNode();
    }
    addRoute(path, method, handler) {
        const url = new url_1.URL(path, constants_js_1.baseUrl);
        const segments = url.pathname
            .split("/")
            .filter((value) => !(value.length == 0));
        const dynamicParams = [];
        let currentNode = this.root;
        for (const segment of segments) {
            const isDynamic = segment[0] === ":";
            const key = isDynamic ? ":" : segment;
            if (isDynamic) {
                dynamicParams.push(segment.slice(1));
            }
            if (!currentNode.children.has(key)) {
                const newNode = new RouteNode();
                currentNode.children.set(key, newNode);
            }
            currentNode = currentNode.children.get(key);
        }
        currentNode.handler.set(method, handler);
        currentNode.params = dynamicParams;
    }
    findRoute(path, method) {
        const url = new url_1.URL(path, "https://base.com/");
        const segments = url.pathname
            .split("/")
            .filter((value) => !(value.length == 0));
        const queryParams = url.searchParams;
        let currentNode = this.root;
        const extractedParams = [];
        for (const segment of segments) {
            const childNode = currentNode.children.get(segment);
            if (childNode) {
                currentNode = childNode;
            }
            else if (currentNode.children.has(":")) {
                extractedParams.push(segment);
                currentNode = currentNode.children.get(":");
            }
            else {
                return null;
            }
        }
        const params = {};
        for (const [param, value] of currentNode.params.map((param, index) => [
            param,
            extractedParams[index],
        ])) {
            params[param] = value;
        }
        return {
            handler: currentNode.handler.get(method),
            params,
            queryParams,
        };
    }
    printTree(node = this.root, indentation = 0) {
        const indent = "-".repeat(indentation);
        node.children.forEach((childNode, segment) => {
            console.log(`${indent}${segment}`);
            this.printTree(childNode, indentation + 1);
        });
    }
    get(path, handler) {
        this.addRoute(path, "GET", handler);
    }
    post(path, handler) {
        this.addRoute(path, "POST", handler);
    }
    put(path, handler) {
        this.addRoute(path, "PUT", handler);
    }
    patch(path, handler) {
        this.addRoute(path, "PATCH", handler);
    }
    head(path, handler) {
        this.addRoute(path, "HEAD", handler);
    }
    delete(path, handler) {
        this.addRoute(path, "DELETE", handler);
    }
    options(path, handler) {
        this.addRoute(path, "OPTIONS", handler);
    }
    trace(path, handler) {
        this.addRoute(path, "TRACE", handler);
    }
    connect(path, handler) {
        this.addRoute(path, "CONNECT", handler);
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map