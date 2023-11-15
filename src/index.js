import 'dotenv/config';
import { connectDB } from './db.js';
import app from './app.js'

const uri = process.env.MONGO_URI;
if (!uri) {
  throw '尚未設定MONGO_URI';
}
const dbName = process.env.MONGO_DB
if (!dbName) {
  throw '尚未設定MONGO_DB';
}
await connectDB(uri, dbName);

const port = process.env.PORT;
if (!port) {
  throw '尚未指定PORT';
}
app.listen(port);