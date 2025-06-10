export default class Credentials {
  identifier: string;
  password: string;

  static empty(): Credentials {
    return new Credentials("", "");
  }

  constructor(identifier: string, password: string) {
    this.identifier = identifier;
    this.password = password;
  }
}
