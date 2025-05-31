const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

const USERS_FILE = './users.json';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve dashboard.html as homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.get('/api/users', (req, res) => {
  res.json(getUsers());
});

app.post('/api/users', (req, res) => {
  const { name, email, street, city, zip } = req.body;
  if (!name || !email || !street || !city || !zip) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const user = { name, email, street, city, zip };
  saveUser(user);
  res.json({ message: 'User added successfully', user });
});

// Serve add user page
app.get('/user', (req, res) => {
  res.sendFile(__dirname + '/public/add user.html');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
