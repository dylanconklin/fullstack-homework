import { AtpAgent } from "@atproto/api";
import * as fs from "fs";
import { getAgent } from "../agent";
import Credentials from "../credentials";
import Post from "../post";
import { getHotPosts, getTopicalPosts } from "../postGetters";

describe("Post Getter Tests", () => {
  it("successfully retrieves hot posts", async () => {
    let credentials: Credentials = JSON.parse(
      fs.readFileSync("credentials.json", {
        encoding: "utf-8",
      })
    );

    let agent: AtpAgent = await getAgent(credentials);
    let posts: Post[] = await getHotPosts(agent);

    expect(posts.length).toBeGreaterThanOrEqual(1);
  });

  it("successfully retrieves topical posts", async () => {
    let credentials: Credentials = JSON.parse(
      fs.readFileSync("credentials.json", {
        encoding: "utf-8",
      })
    );

    let agent: AtpAgent = await getAgent(credentials);
    let posts: Post[] = await getTopicalPosts(agent, "test");

    expect(posts.length).toBeGreaterThanOrEqual(1);
  });
});
