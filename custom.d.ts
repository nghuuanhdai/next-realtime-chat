interface IMongooseConnectionCache{
  conn: typeof mongoose | null,
  promise: Promise<typeof mongoose> | null
}

declare global {
  var cachedMongoose: IMongooseConnectionCache
}

export {};