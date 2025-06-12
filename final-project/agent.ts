import { AtpAgent } from "@atproto/api";
import Credentials from "./credentials";

export function getLogin(req: any): Credentials {
  const result: Credentials = JSON.parse(req.cookies.credentials);
  return result;
}

export async function getAgent(credentials: Credentials): Promise<AtpAgent> {
  const agent = new AtpAgent({
    service: "https://bsky.social",
  });
  await agent.login(credentials);
  return agent;
}
