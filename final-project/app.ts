import pug from "pug";
import express from "express";
import { AtpAgent } from "@atproto/api";
import Post from "./post";
import cookieParser from "cookie-parser";
import Credentials from "./credentials";

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

async function getAgent(req): Promise<AtpAgent> {
  const agent = new AtpAgent({
    service: "https://bsky.social",
  });
  await agent.login(getLogin(req));
  return agent;
}

async function getPosts(
  req,
  searchTerm: string | undefined = undefined
): Promise<Post[] | undefined> {
  let result: Post[] | undefined = undefined;
  try {
    const agent = await getAgent(req);
    result =
      searchTerm == undefined
        ? await getHotPosts(agent)
        : await getTopicalPosts(agent, searchTerm);
  } catch (e) {}
  return result;
}

async function getHotPosts(agent: AtpAgent): Promise<Post[]> {
  const feed = await agent.app.bsky.feed.getFeed({
    feed: "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot",
    limit: 100,
  });
  return feed.data.feed.map((e) => new Post(agent, e.post));
}

async function getTopicalPosts(agent: AtpAgent, term: string): Promise<Post[]> {
  const feed = await agent.app.bsky.feed.searchPosts({
    q: term,
    limit: 100,
  });
  return feed.data.posts.map((e) => new Post(agent, e));
}

function getSearchTerms(req) {
  let result: string[] = [];
  try {
    result = JSON.parse(req.cookies.searchTerms);
  } catch (e) {
    result = [];
  }
  return result;
}
