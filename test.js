import { Router } from "./lib/router";
import { run } from "./lib/index";

const router = new Router();

// Define the routes
router.get("/", (req, res) => {
  res.end("Hello from the root endpoint");
});

router.get("/user/:name", (req, res) => {
  res.end(`Hello, ${req.params.name}!`);
});

router.get("/user/:age/class/:subject", (req, res) => {
  res.end(`You're ${req.params.age} years old, and you're studying ${req.params.subject}.`);
});

// Start the server at port 3000
run(router, 3000);