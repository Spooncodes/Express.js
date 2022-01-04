const PORT = process.env.PORT || 3000;
const express = require('express');
const path = require('path');
const uuid = require('uuid').v4;
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


//  GET REQUEST 
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', function (err, contents) {
      var words = JSON.parse(contents);
      res.send(words);
    });
  });
  
  
//  POST REQUEST 
app.post('/api/notes', (req, res) => {
    fs.readFile('db/db.json', (err, contents) => {
      // Check for error
      if (err) throw err;
      // Handle data gathering for json update
      let json = JSON.parse(contents);
      let note = {
        title: req.body.title,
        text: req.body.text,
        id: uuid()
      }

    // Add data to existing json array
    json.push(note);
  
    // Write updated json to array 
    fs.writeFile('db/db.json', JSON.stringify(json, null, 2), (err) => {
        // Check for error
        if (err) throw err;
        res.send('200');
    });
    });
});
  
// DELETE REQUEST 
app.delete('/api/notes/:id', (req, res) => {
  
    fs.readFile('db/db.json', (err, contents) => {
      // Check for error
      if (err) throw err;
      let deleteId = req.params.id;
      // Handle data gathering for json update
      let json = JSON.parse(contents);
      json.forEach((item, i) => {
        if (item.id.includes(deleteId)) {
          json.splice(i, 1);
        }
      });
  
    // Write updated json to array 
    fs.writeFile('db/db.json', JSON.stringify(json, null, 2), (err) => {
        // Check for error
        if (err) throw err;
        res.send('200');
      });
    });
  
  })

// ROUTES 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT);