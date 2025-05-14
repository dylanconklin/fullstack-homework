import pug from "pug";
import express from "express";

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
      pug.renderFile("list_page.pug", {
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
      pug.renderFile("list_page.pug", {
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
      pug.renderFile("list_page.pug", {
        title: "Regions of the World",
        items: values,
      })
    );
});

app.use((req, res) => {
  res.status(404).type("html").send("<h1>404 - page not found</h1>");
});

app.listen(port, () => {
  console.log("Server running at http:localhost:${port}");
});
