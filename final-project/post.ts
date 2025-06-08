import { AtpAgent, AppBskyFeedPost } from "@atproto/api";
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
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

  constructor(agent: AtpAgent, post: FeedViewPost) {
    this.agent = agent;
    this.cid = post.post.cid;
    this.uri = post.post.uri;
    this.author = new Author(
      post.post.author.displayName ?? post.post.author.handle,
      post.post.author.handle,
      post.post.author.avatar!
    );
    this.likeCount = post.post.likeCount ?? 0;
    this.liked = false;
    this.text = (post.post.record as AppBskyFeedPost.Record).text;
    if (
      post.post.embed &&
      post.post.embed.$type === "app.bsky.embed.images#view"
    ) {
      this.images = (
        post.post.embed as { images: { fullsize: string }[] }
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
