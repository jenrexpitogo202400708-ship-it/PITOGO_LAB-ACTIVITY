const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const movies = [
  { id: 1, title: "Avengers: Endgame", genre: "Action", year: "2019" },
  { id: 2, title: "Titanic", genre: "Romance", year: "1997" },
  { id: 3, title: "The Dark Knight", genre: "Action", year: "2008" },
  { id: 4, title: "Frozen", genre: "Animation", year: "2013" },
  { id: 5, title: "Inception", genre: "Sci-Fi", year: "2010" },
];

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/movies/:id', (req, res) => {
  const item = movies.find(m => m.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

app.post('/movies', (req, res) => {
  const { title, genre, year } = req.body;

  if (!title || !genre || !year) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newMovie = {
    id: Date.now(),
    title,
    genre,
    year
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.put('/movies/:id', (req, res) => {
  const item = movies.find(m => m.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: "Not found" });

  const { title, genre, year } = req.body;

  if (title) item.title = title;
  if (genre) item.genre = genre;
  if (year) item.year = year;

  res.json(item);
});

app.delete('/movies/:id', (req, res) => {
  const index = movies.findIndex(m => m.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Not found" });

  movies.splice(index, 1);
  res.json({ message: "Deleted" });
});

app.get('/movies/genre/:genre', (req, res) => {
  res.json(
    movies.filter(m =>
      m.genre.toLowerCase() === req.params.genre.toLowerCase()
    )
  );
});

app.get('/search', (req, res) => {
  const title = (req.query.title || "").toLowerCase();
  res.json(
    movies.filter(m =>
      m.title.toLowerCase().includes(title)
    )
  );
});

app.get('/random', (req, res) => {
  res.json(movies[Math.floor(Math.random() * movies.length)]);
});

app.get('/stats', (req, res) => {
  const stats = {};
  movies.forEach(m => {
    stats[m.genre] = (stats[m.genre] || 0) + 1;
  });
  res.json(stats);
});

app.get('/top-movies', (req, res) => {
  res.json(movies.slice(0, 3));
});

app.get('/health', (req, res) => {
  res.json({ status: "API running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});