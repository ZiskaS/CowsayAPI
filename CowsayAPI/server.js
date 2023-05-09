const express = require('express');
// Constants
const cowsay = require('cowsay');
const hostname = '0.0.0.0';
const port = 8080;

// App
const app = express();
const bodyParser = require('body-parser');
const { promisify } = require('util');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://mongodb-container:27017'; const dbName = 'mock_database';
const collectionName = 'users';
app.use(bodyParser.json()); // for parsing application/json
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//GET method route
app.get('/cowsay', function(req, res, next){
    res.send(cowsay.say({
                                text: "una vaca que habla",
                                e: "OO",
                                T: "U"
                            })
                )
    }
);


// POST method route to insert customized text
app.post('/cowsay', function(request, response){
    response.send(cowsay.say({
                                text: request.query.quote,
                                e: "OO",
                                T: "U"
                            })
                )
    }
);




// GET method route
app.get('/', function (req, res) {
    res.send('GET request to the homepage');
});
  
// POST method route
app.post('/', function (req, res) {
    res.send('POST request to the homepage');
});

// GET method route
app.get('/secret', function (req, res, next) {
    res.send('Never be cruel, never be cowardly. And never eat pears!');
    console.log('This is a console.log message.');
});

/*
Your implementation here 
*/

// // Connect to mongodb server
// const MongoClient = require('mongodb').MongoClient;
// /* Your url connection to mongodb container */ 
// const url = ...;
// answer: mongodb://mongodb-container:27017/mock_database



// GET method route
// Retrieve all documents in collection
app.get('/users', async (req, res) => {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();
        res.send(documents);
    } catch (error) {
        res.status(500).send('Error retrieving users');
        console.error('This is a console.error message.');
    }
});

// GET method route
// Query by a certain field(s)
// ...
app.get('/users/search', async (req, res) => {
    try {
      const { gender } = req.query;
  
      // Construct the search query based on the provided query parameters
      const searchQuery = {};
      if (gender) searchQuery.gender = "Male";
  
      // Retrieve documents from the collection that match the search query
      const documents = await db.collection(collectionName).find(searchQuery).toArray();
  
      // Send the documents as the response
      res.send(documents);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error searching for users');
    }
  });

/* PUT method. Modifying the message based on certain field(s). 
If not found, create a new document in the database. (201 Created)
If found, message, date and offset is modified (200 OK) */
// ...
app.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    const newUser = req.body;
  
    const client = new MongoClient(url);
    try {
      // Connect to MongoDB
      await client.connect();
      const db = client.db(dbName);
  
      // Check if the user already exists
      const existingUser = await db.collection(collectionName).findOne({ _id: id });
      if (existingUser) {
        // Update the user data and return a success message
        const currentDate = new Date();
        const result = await db.collection(collectionName).updateOne(
          { _id: id },
          { $set: { ...newUser, message: 'User data updated', date: currentDate, offset: 0 } }
        );
        res.status(200).json({ message: 'User data updated', result });
      } else {
        // Insert a new user and return a success message
        const result = await db.collection(collectionName).insertOne(newUser);
        res.status(201).json({ message: 'User added', result });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  });

/* DELETE method. Modifying the message based on certain field(s).
If not found, do nothing. (204 No Content)
If found, document deleted (200 OK) */
// ...
app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
  
    const client = new MongoClient(url);
    try {
      await client.connect();
      const db = client.db(dbName);
  
      const result = await db.collection(collectionName).deleteOne({ _id: id });
      if (result.deletedCount > 0) {
        const currentDate = new Date();
        res.status(200).json({ message: 'User deleted', date: currentDate, offset: 0 });
      } else {
        const newUser = req.body;
        await db.collection(collectionName).insertOne({ ...newUser, _id: id });
        const currentDate = new Date();
        res.status(201).json({ message: 'User added', date: currentDate, offset: 0 });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  });
  
app.listen(port, hostname);
console.log(`Running on http://${hostname}:${port}`);

