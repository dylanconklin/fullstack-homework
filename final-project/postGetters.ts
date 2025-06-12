import { AtpAgent } from "@atproto/api";
import { getAgent, getLogin } from "./agent";
import Post from "./post";

export async function getPosts(
  req,
  searchTerm: string | undefined = undefined
): Promise<Post[] | undefined> {
  let result: Post[] | undefined = undefined;
  try {
    const credentials = getLogin(req);
    const agent = await getAgent(credentials);
    result =
      searchTerm == undefined
        ? await getHotPosts(agent)
        : await getTopicalPosts(agent, searchTerm);
  } catch (e) {}
  return result;
}

export async function getHotPosts(agent: AtpAgent): Promise<Post[]> {
  const feed = await agent.app.bsky.feed.getFeed({
    feed: "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot",
    limit: 100,
  });
  return feed.data.feed.map((e) => new Post(e.post));
}

export async function getTopicalPosts(
  agent: AtpAgent,
  term: string
): Promise<Post[]> {
  const feed = await agent.app.bsky.feed.searchPosts({
    q: term,
    limit: 100,
  });
  return feed.data.posts.map((e) => new Post(e));
}

export function getSearchTerms(req) {
  let result: string[] = [];
  try {
    result = JSON.parse(req.cookies.searchTerms);
  } catch (e) {
    result = [];
  }
  return result;
}
