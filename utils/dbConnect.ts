import mongoose from 'mongoose'

if(!process.env.MONGODB_URI)
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')

const MONGODB_URI:string = process.env.MONGODB_URI
if(!global.cachedMongoose)
  global.cachedMongoose = { conn: null, promise: null }

async function dbConnect() {
  if(global.cachedMongoose.conn)
    return global.cachedMongoose.conn

  if(!global.cachedMongoose.promise)
  {
    const opts : mongoose.ConnectOptions = {bufferCommands: false}
    global.cachedMongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose)=>{return mongoose})
  }

  global.cachedMongoose.conn = await global.cachedMongoose.promise
  return global.cachedMongoose.conn
}

export default dbConnect