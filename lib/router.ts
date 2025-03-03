import { IncomingMessage, ServerResponse } from "http";

import { HTTPMethod } from "./constants.ts";

interface DynamicParams {
  [key: string]: string;
}

export interface IncomingRequest extends IncomingMessage {
  params?: DynamicParams;
}

type RouteHandler = (req: IncomingRequest, res: ServerResponse<IncomingMessage>) => void;

class RouteNode {
  children: Map<string, RouteNode>;
  handler: Map<HTTPMethod, RouteHandler>;
  params: string[];

  public constructor() {
    this.children = new Map();
    this.handler = new Map();
    this.params = [];
  }
}

export class Router {
  root: RouteNode;

  public constructor() {
    this.root = new RouteNode();
  }

  private addRoute(path: string, method: HTTPMethod, handler: RouteHandler) {

    const segments = path.replace(/^\/+\/+$/,"").split("/");
    const dynamicParams: string[] = [];

    if (segments.some((segment) => segment.includes(" "))) {
      throw new Error(`Incorrectly specified path ${path} - path should contain no whitespace`)
    }

    let currentNode = this.root;
    for (const segment of segments) {
      const isDynamic = segment[0] === ":";
      const key = isDynamic ? ":": segment;

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

  public findRoute(path: string, method: HTTPMethod): { params: DynamicParams, handler: RouteHandler } | null {

    const segments = path.replace(/^\/+\/+$/,"").split("/");

    let currentNode = this.root;
    const extractedParams: string[] = [];

    for (const segment of segments) {
      const childNode = currentNode.children.get(segment);

      if (childNode) {
        currentNode = childNode;
      } else if (currentNode.children.has(":")) {
        extractedParams.push(segment);
        currentNode = currentNode.children.get(":");
      } else {
        return null;
      }
    }

    const params: DynamicParams = {};

    for (const [param, value] of currentNode.params.map((param, index) => [param, extractedParams[index]])) {
      params[param] = value;
    }

    return {
      params,
      handler: currentNode.handler.get(method)
    }
  }

  public printTree(node = this.root, indentation = 0) {
    const indent = "-".repeat(indentation);

    node.children.forEach((childNode, segment) => {
      console.log(`${indent}${segment}`);
      this.printTree(childNode, indentation + 1);
    });
  }

  public get(path: string, handler: RouteHandler) {
    this.addRoute(path, "GET", handler);
  }

  public post(path: string, handler: RouteHandler) {
    this.addRoute(path, "POST", handler);
  }

  public put(path: string, handler: RouteHandler) {
    this.addRoute(path, "PUT", handler);
  }

  public patch(path: string, handler: RouteHandler) {
    this.addRoute(path, "PATCH", handler);
  }

  public head(path: string, handler: RouteHandler) {
    this.addRoute(path, "HEAD", handler);
  }

  public delete(path: string, handler: RouteHandler) {
    this.addRoute(path, "DELETE", handler);
  }

  public options(path: string, handler: RouteHandler) {
    this.addRoute(path, "OPTIONS", handler);
  }

  public trace(path: string, handler: RouteHandler) {
    this.addRoute(path, "TRACE", handler);
  }

  public connect(path: string, handler: RouteHandler) {
    this.addRoute(path, "CONNECT", handler);
  }
}