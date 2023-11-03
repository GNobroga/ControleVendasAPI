import Redis from 'ioredis';

export default class RedisCache {

  private _redis: Redis;

  constructor() {
    this._redis = new Redis();
  }

  public async save(key: string, value: any) {
    console.log(key, value);
    await this._redis.set(key, JSON.stringify(value));
  }

  public async get(key: string): Promise<any | null> {
    const data = await this._redis.get(key);

    if (!data) return null;

    return JSON.parse(data);
  }

  declare remove: (key: string) => void; /// Isso e usado em rotas que alteram a key
};