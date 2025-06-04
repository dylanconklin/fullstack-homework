import pug from "pug";
import express from "express";
import { BskyAgent } from "@atproto/api";

const app = express();
const port = process.env.port || 5001;

const routes = ["home", "capitals", "populous", "regions"];

app.get("/", (req, res) => {
  res.redirect(302, "/home");
});

app.get("/home", (req, res) => {
  res
    .status(200)
    .type("html")
    .send(pug.renderFile("home_page.pug", { title: "Home" }));
});

app.get("/capitals", async (req, res) => {
  let values: string[] = [];
  const countries = await fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then(
      (data) =>
        (values = data
          .map((e) => [e.name.common, e.capital].join(" - "))
          .sort())
    )
    .catch((error) => console.error(error));
  res
    .status(200)
    .type("html")
    .send(
      pug.renderFile("feed.pug", {
        title: "Countries and Capitals",
        items: values,
      })
    );
});

app.get("/populous", async (req, res) => {
  let values: string[] = [];
  const countries = await fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then(
      (data) =>
        (values = data
          .map((e) => [e.name.common, e.population].join(" - "))
          .sort())
    )
    .catch((error) => console.error(error));
  res
    .status(200)
    .type("html")
    .send(
      pug.renderFile("feed.pug", {
        title: "Most Populous Countries",
        items: values,
      })
    );
});

app.get("/regions", async (req, res) => {
  let values: string[] = [];
  const countries = await fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      let regions: Set<string> = new Set(
        data.map((e) =>
          [e.region, data.filter((c) => c.region == e.region).length].join(
            " - "
          )
        )
      );
      values = Array.from(regions).sort();
    })
    .catch((error) => console.error(error));
  res
    .status(200)
    .type("html")
    .send(
      pug.renderFile("feed.pug", {
        title: "Regions of the World",
        items: values,
      })
    );
});

app.get("/feed", async (req, res) => {
  const agent = new BskyAgent({
    service: "https://bsky.social",
  });
  await agent.login({
    identifier: "culls.mourner_51@icloud.com",
    password: "9WKij1zDGahZsqn",
  });
  // const { data } = await agent.getTimeline({
  //   // cursor: "...",
  //   // limit: 30,
  // });
  const { data } = await agent.app.bsky.feed.getFeed({
    feed: "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot",
    limit: 3,
  });
  const { feed: postsArray, cursor: nextPage } = data;
  console.log(JSON.stringify(data, null, 2));
  postsArray.forEach((a) => {
    console.log(a.post.record.text);
  });
  res
    .status(200)
    .type("html")
    .send(
      pug.renderFile("feed.pug", {
        title: "Feed",
        items: postsArray,
      })
    );
});

app.use((req, res) => {
  res.status(404).type("html").send(pug.renderFile("404.pug"));
});

app.listen(port, () => {
  console.log("Server running at http:localhost:" + port);
});
