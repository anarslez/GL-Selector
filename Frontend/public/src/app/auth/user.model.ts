export class User {
  constructor (
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public joinedDate: string,
    private _token: string,
    private _exp: number,
  ) {}

  get token () {
    if (!this._exp || new Date().getTime() > (this._exp * 1000)) {
      return null;
    }
    return this._token;
  }

  get tokenExp () {
    if (!this._exp || new Date().getTime() > (this._exp * 1000)) {
      return null;
    }
    return this._exp * 1000;
  }
}
