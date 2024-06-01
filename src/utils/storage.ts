export default class Storage<T = {}> {
  private readonly key: string;
  public constructor (key: string, setup_data?: T) {
    this.key = key;
    if (setup_data) this.setup(setup_data);
  }
  public setup (data: T): void {
    if (!window.localStorage.getItem(this.key)) {
      window.localStorage.setItem(this.key, JSON.stringify(data));
    }
  }
  public get (): T {
    return JSON.parse(window.localStorage.getItem(this.key) || '{}');
  }
  public set (data: T): void {
    window.localStorage.setItem(this.key, JSON.stringify(data));
  }
}
