// Its only task when the system is well-structured is: import libraries, register routes, and start the server

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Built-in module, does not require installation

// Route imports
const pagesRoutes = require('./routes/pageroutes'); // Route handler for GET page requests
const authRoutes = require('./routes/auth'); // Route handler for auth POST requests

const app = express();
const port = 3005;

// Body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend/public
app.use(express.static(path.join(__dirname, '../../../frontend/public')));

// Route handling
app.use('/', pagesRoutes);
app.use('/', authRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
