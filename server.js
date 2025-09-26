const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

const url = `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DATABASE}`;

let client;
let db;

async function startWithRetry() {
  try {
    client = new MongoClient(url, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 5
    });
    
    await client.connect();
    console.log("Connected to MongoDB");
    
    db = client.db(process.env.MONGODB_DATABASE);

    app.listen(8080, () => {
      app.get("/catalog/healthz", (req, res) => {
        res.sendStatus(200);
      });

      app.get("/catalog", async (req, res) => {
        try {
          console.log(`GET /catalog`);
          const results = await db.collection('catalog').find().toArray();
          res.json(results);
        } catch (err) {
          console.log(`failed to query movies: ${err}`);
          res.json([]);
        }
      });

      console.log("Server running on port 8080.");
    });
  } catch (err) {
    console.error(`Error connecting, retrying in 1 sec: ${err}`);
    setTimeout(startWithRetry, 1000);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});

startWithRetry();