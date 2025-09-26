const { MongoClient } = require("mongodb");

const url = `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DATABASE}`;

async function insert(collection, data) {
  const d = require(data);
  d.results.forEach((doc) => {
    doc._id = doc.id;
  });
  
  try {
    await collection.insertMany(d.results, { ordered: false });
  } catch (err) {
    if (err.code !== 11000) {
      throw err;
    }
    // Ignore duplicate key errors (documents already exist)
    console.log('Some documents already exist, continuing...');
  }
}

async function loadWithRetry() {
  let client;
  try {
    client = new MongoClient(url, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(process.env.MONGODB_DATABASE);
    
    await insert(db.collection('catalog'), "./data/catalog.json");
    
    console.log('all loaded');
    process.exit(0);
  } catch (err) {
    console.error(`Error connecting, retrying in 1 sec: ${err}`);
    if (client) {
      await client.close();
    }
    setTimeout(loadWithRetry, 1000);
  }
};

loadWithRetry();
