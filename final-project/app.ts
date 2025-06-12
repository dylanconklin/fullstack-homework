import pug from "pug";
import express from "express";
import Post from "./post";
import cookieParser from "cookie-parser";
import Credentials from "./credentials";
import { getAgent, getLogin } from "./agent";
import { getPosts, getSearchTerms } from "./postGetters";

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
  res
    .cookie("credentials", JSON.stringify(credentials))
    .redirect(302, "/whats-hot");
});

app.get("/whats-hot", async (req, res) => {
  const posts: Post[] | undefined = await getPosts(req);
  if (posts == undefined) {
    res.redirect(302, "/login");
  } else {
    res
      .status(200)
      .type("html")
      .send(
        pug.renderFile("feed.pug", {
          title: "What's Hot",
          feed: await getPosts(req),
          searchTerms: getSearchTerms(req),
        })
      );
  }
});

app.post("/search", async (req, res) => {
  const term: string = req.body.term;
  if (term.length == 0) {
    res.redirect(302, "/whats-hot");
  } else {
    let searchTerms: string[] = getSearchTerms(req);
    if (searchTerms.includes(term)) {
      searchTerms = searchTerms.filter((e) => e != term);
    }
    searchTerms.reverse().push(term);
    searchTerms.reverse();
    if (searchTerms.length > 5) {
      searchTerms.pop();
    }
    res
      .cookie("searchTerms", JSON.stringify(searchTerms))
      .redirect(302, "/topic");
  }
});

app.get("/topic", async (req, res) => {
  let searchTerms: string[] = getSearchTerms(req);
  if (searchTerms.length == 0) {
    res.redirect(302, "/whats-hot");
  }
  const posts: Post[] | undefined = await getPosts(req, searchTerms[0]);
  if (posts == undefined) {
    res.redirect(302, "/login");
  } else {
    res
      .status(200)
      .type("html")
      .send(
        pug.renderFile("feed.pug", {
          title: searchTerms[0],
          feed: posts,
          searchTerms: searchTerms,
        })
      );
  }
});

app.post("/like", async (req, res) => {
  const credentials = getLogin(req);
  const agent = await getAgent(credentials);
  const postInfo = JSON.parse(req.body.post);
  await agent.like(postInfo.uri, postInfo.cid);
  res.redirect(302, "/whats-hot");
});

app.post("/comment", async (req, res) => {
  const credentials = getLogin(req);
  const agent = await getAgent(credentials);
  // Add code to comment here
  console.log(req.body.comment);
  res.redirect(302, "/whats-hot");
});

app.use((req, res) => {
  res.status(404).type("html").send(pug.renderFile("404.pug"));
});

app.listen(port, () => {
  console.log("Server running at http:localhost:" + port);
});
