const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const mime = require("mime");

const findAsset = name => {
  return new Promise((resolve, reject) => {
    const assetPath = path.join(__dirname, "assets", name);
    fs.readFile(assetPath, { encoding: "utf-8" }, (err, asset) => {
      if (err) {
        reject(err);
      } else {
        resolve(asset);
      }
    });
  });
};

const hostname = "127.0.0.1";
const port = 3000;
const router = {
  //add as more as u can
  "/ GET": {
    asset: "index.html",
    type: mime.getType("html")
  },
  "/style.css GET": {
    asset: "style.css",
    type: mime.getType("css")
  }
};

const logRequest = (method, route, status) =>
  console.log(method, route, status);

const server = http.createServer(async (req, res) => {
  const method = req.method;
  const route = url.parse(req.url).pathname;
  const routeMatch = router[`${route} ${method}`];

  if (!routeMatch) {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.write(await findAsset("404.html"));
    logRequest(method, route, 404);
    res.end();
    return;
  }

  const { type, asset } = routeMatch;
  res.writeHead(200, { "Content-Type": type });
  res.write(await findAsset(asset));
  logRequest(method, route, 200);
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
