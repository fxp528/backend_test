import 'dotenv/config';
import { connectDB } from './db';
import app from './app'

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw '尚未設定MONGO_URI';
  }
  const dbName = process.env.MONGO_DB
  if (!dbName) {
    throw '尚未設定MONGO_DB';
  }
  const dbConnection = await connectDB(uri, dbName);

  const port = process.env.PORT;
  if (!port) {
    throw '尚未指定PORT';
  }
  const server = app.listen(port);
  server.on('close', async () => {
    console.log('執行關閉程序...');
    await dbConnection.close();
    console.log('關閉程序完成');
  });
}

main();