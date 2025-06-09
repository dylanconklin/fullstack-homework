import pug from "pug";
import express from "express";
import { AtpAgent } from "@atproto/api";
import Post from "./post";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 5001;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.redirect(302, "/whats-hot");
});

app.get("/login", (req, res) => {
  res.status(200).type("html").send(pug.renderFile("login.pug"));
});

app.post("/login", (req, res) => {
  const credentials: Credentials = new Credentials(
    req.body.email,
    req.body.password
  );
  res.cookie("credentials", JSON.stringify(credentials)).redirect(302, "/home");
});

app.get("/whats-hot", async (req, res) => {
  const agent = new AtpAgent({
    service: "https://bsky.social",
  });
  await agent.login(getLogin(req));
  const { data } = await agent.app.bsky.feed.getFeed({
    feed: "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot",
    limit: 100,
  });
  const feed = data.feed.map((e) => new Post(agent, e.post));
  res
    .status(200)
    .type("html")
    .send(
      pug.renderFile("feed.pug", {
        title: "What's Hot",
        feed: feed,
      })
    );
});

app.post("/search", async (req, res) => {
  const term: string = req.body.term;
  const agent = new AtpAgent({
    service: "https://bsky.social",
  });
  await agent.login(getLogin(req));
  const { data } = await agent.app.bsky.feed.searchPosts({
    q: term,
    limit: 100,
  });
  const feed = data.posts.map((e) => new Post(agent, e));
  res
    .status(200)
    .type("html")
    .send(
      pug.renderFile("feed.pug", {
        title: term,
        feed: feed,
      })
    );
});

app.use((req, res) => {
  res.status(404).type("html").send(pug.renderFile("404.pug"));
});

app.listen(port, () => {
  console.log("Server running at http:localhost:" + port);
});

function getLogin(req: any): Credentials {
  const result: Credentials = JSON.parse(req.cookies.credentials);
  return result;
}
