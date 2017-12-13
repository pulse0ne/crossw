const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const api = require('./api');

const app = express();

app.use(express.static(path.join(__dirname, '../dist')));

api(app, path.join(__dirname, 'puzzles'));

app.listen(8765);
