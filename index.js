console.log("Index file started!");
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = "mongodb+srv://anwarhossen0258_db_user:OQCMbqzC58hilUz2@cluster0.g6i8ta9.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB
async function run() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully!");

    const db = client.db('movie');
    const movieCollection = db.collection('movies');

    // Default route
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    // POST: Add multiple movies
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

    // GET: Fetch all movies
    app.get('/movies', async (req, res) => {
      try {
        const movies = await movieCollection.find().toArray();
        res.send(movies);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // GET: Fetch movies by category
    app.get('/movies/:category', async (req, res) => {
      try {
        const category = req.params.category;
        const movies = await movieCollection.find({ category }).toArray();
        res.send(movies);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // GET: Fetch single movie by ID
    app.get('/movie/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const movie = await movieCollection.findOne({ id });
        res.send(movie);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

      // POST: Add movie to user's collection
    app.post("/add-to-collection/:uid", async (req, res) => {
      const { uid } = req.params;
      const movie = req.body;

      try {
        await userCollection.updateOne(
          { uid },
          { $push: { movies: movie } },
          { upsert: true }
        );
        res.send({ success: true });
      } catch (err) {
        res.status(500).send({ error: err.message });
      }
    });

    // Start the server after DB is connected
    app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });

  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

run().catch(console.dir);
