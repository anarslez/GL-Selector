export class User {
  constructor (
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public joinedDate: string,
    private _token: string,
    private _exp: any,
  ) {}

  get token () {
    if (!this._exp || new Date() > this._exp) {
      return null;
    }
    return this._token;
  }
}
