export default class Author {
  username: string;
  handle: string;
  avatar: string;
  profileURL: string;

  constructor(username: string, handle: string, avatar: string) {
    this.username = username;
    this.handle = handle;
    this.avatar = avatar;
    this.profileURL = ["https://bsky.app", "profile", this.handle].join("/");
  }
}
