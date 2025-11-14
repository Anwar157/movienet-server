const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://anwarhossen0258_db_user:OQCMbqzC58hilUz2@cluster0.g6i8ta9.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db('movie');
const movieCollection = db.collection('movies');

// default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// POST: add many movies
app.post('/add-movies', async (req, res) => {
  try {
    const moviesData = req.body;
    let allMovies = [];

    for (const category in moviesData) {
      allMovies = allMovies.concat(moviesData[category]);
    }

    const result = await movieCollection.insertMany(allMovies);
    res.send(result);
    
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
