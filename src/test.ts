import { Router } from "./router.js";
// import { run } from "./index";

const router = new Router();

// Define the routes
router.get("/", (req, res) => {
  res.end("Hello from the root endpoint");
});

router.get("/user/:name", (req, res) => {
  res.end(`Hello, ${req.params?.name}!`);
});

router.get("/user/:age/class/:subject", (req, res) => {
  res.end(`You're ${req.params?.age} years old, and you're studying ${req.params?.subject}.`);
});

router.printTree();
const { params, queryParams } = router.findRoute("/user/doug?test=blank&poop=pee", "GET") ?? {};
console.log(params);
console.log(queryParams);

const another = router.findRoute("/user/36/class/math", "GET");
console.log(another?.params);
console.log(another?.queryParams);

const nowAnother = router.findRoute("/shouldfail", "GET");
console.log(nowAnother);


// Start the server at port 3000
// run(router, 3000);