import Post from "../post";
import * as fs from "fs";

describe("Photo and Photo Carousel Tests", () => {
  it("has no photos", async () => {
    let post: Post = JSON.parse(
      fs.readFileSync("tests/sample_posts/no_image_post.json", {
        encoding: "utf-8",
      })
    );

    expect(post.images).toBe(undefined);
  });

  it("has one photo", async () => {
    let post: Post = JSON.parse(
      fs.readFileSync("tests/sample_posts/single_image_post.json", {
        encoding: "utf-8",
      })
    );

    expect(post.images?.length).toBe(1);
  });

  it("has two photos", async () => {
    let post: Post = JSON.parse(
      fs.readFileSync("tests/sample_posts/multiple_image_post.json", {
        encoding: "utf-8",
      })
    );

    expect(post.images?.length).toBe(2);
  });
});
