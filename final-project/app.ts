import pug from "pug";
import express from "express";
import { BskyAgent } from "@atproto/api";
import { AtpAgent, AppBskyFeedPost } from "@atproto/api";

const app = express();
const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.redirect(302, "/home");
});

app.get("/home", (req, res) => {
  res
    .status(200)
    .type("html")
    .send(pug.renderFile("home_page.pug", { title: "Home" }));
});

app.get("/login", (req, res) => {
  res.status(200).type("html").send(pug.renderFile("login.pug"));
});

app.get("/whats-hot", async (req, res) => {
  const agent = new AtpAgent({
    service: "https://bsky.social",
  });
  await agent.login({
    identifier: "culls.mourner_51@icloud.com",
    password: "9WKij1zDGahZsqn",
  });
  const { data } = await agent.app.bsky.feed.getFeed({
    feed: "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot",
    limit: 100,
  });
  const { feed: postsArray, cursor: nextPage } = data;
  const feed = postsArray.map((e) => new Post(agent, e));
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

app.use((req, res) => {
  res.status(404).type("html").send(pug.renderFile("404.pug"));
});

app.listen(port, () => {
  console.log("Server running at http:localhost:" + port);
});
