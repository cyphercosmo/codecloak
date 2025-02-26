declare module 'stegcloak' {
  export default class StegCloak {
    constructor(encrypt?: boolean, integrity?: boolean);
    hide(secret: string, password: string, cover: string): string;
    reveal(data: string, password: string): string;
  }
}