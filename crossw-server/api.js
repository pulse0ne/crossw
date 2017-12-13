const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

module.exports = function (app, puzzleDir) {
    app.use(bodyParser.json());

    app.get('/list', (req, res) => {
        fs.readdir(puzzleDir, (err, files) => {
            if (err) {
                return res.sendStatus(500);
            }

            res.status(200);
            res.send({ files });
        });
    });

    app.post('/puzzle', (req, res) => {
        const filename = req.body.filename;
        const filepath = path.join(puzzleDir, filename);
        fs.access(filepath, fs.constants.F_OK, err => {
            if (err) {
                return res.sendStatus(500);
            }

            fs.readFile(filepath, 'utf-8', (err, data) => {
                if (err) {
                    return res.sendStatus(500);
                }

                try {
                    const puzzle = JSON.parse(data);
                    res.status(200);
                    res.send({ puzzle });
                } catch (e) {
                    res.sendStatus(500);
                }
            });
        });
    });
};
