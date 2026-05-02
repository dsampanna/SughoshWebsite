const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app     = express();
const PORT    = process.env.PORT || 3001;
const DB_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

/* Helper — read data.json */
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { strikes: 0 };
  }
}

/* Helper — write data.json */
function writeData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/* GET /api/strikes — return current count */
app.get('/api/strikes', (req, res) => {
  const data = readData();
  res.json({ strikes: data.strikes });
});

/* POST /api/strikes — increment by 1, return new count */
app.post('/api/strikes', (req, res) => {
  const data = readData();
  data.strikes += 1;
  writeData(data);
  res.json({ strikes: data.strikes });
});

/* Serve static portfolio files from parent folder */
app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
  console.log(`API            → http://localhost:${PORT}/api/strikes`);
});
