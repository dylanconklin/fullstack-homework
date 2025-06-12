import * as fs from "fs";
import { getAgent } from "../agent";
import Credentials from "../credentials";

describe("Credential Tests", () => {
  it("accepts valid credentials", async () => {
    let credentials: Credentials = JSON.parse(
      fs.readFileSync("credentials.json", {
        encoding: "utf-8",
      })
    );

    expect(await getAgent(credentials)).toBeDefined;
  });

  it("rejects invalid credentials", async () => {
    await expect(getAgent(Credentials.empty())).toThrow;
  });
});
