import { AtpAgent, AppBskyFeedPost } from "@atproto/api";
import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import Author from "./author";

export default class Post {
  agent: AtpAgent;
  cid: string;
  uri: string;
  author: Author;
  likeCount: number;
  liked: boolean;
  text: string | undefined;
  images: string[] | undefined;

  constructor(agent: AtpAgent, post: PostView) {
    this.agent = agent;
    this.cid = post.cid;
    this.uri = post.uri;
    this.author = new Author(
      post.author.displayName ?? post.author.handle,
      post.author.handle,
      post.author.avatar!
    );
    this.likeCount = post.likeCount ?? 0;
    this.liked = false;
    this.text = (post.record as AppBskyFeedPost.Record).text;
    if (post.embed && post.embed.$type === "app.bsky.embed.images#view") {
      this.images = (
        post.embed as { images: { fullsize: string }[] }
      ).images.map((img) => img.fullsize);
    }
  }

  toggleLike() {
    if (this.liked) {
      this.agent.deleteLike(this.uri);
    } else {
      this.agent.like(this.uri, this.cid);
    }
    this.liked = !this.liked;
    console.log(`Like is ${this.liked}`);
  }
}
