const express = require('express')
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express()
app.use(bodyParser.json());
const port = 3000

console.log(process.env.DB_PASSWORD)
app.get('/', (req, res) => {
    res.send('Hello World!')
    }
)

app.get('/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM ji_project.music');
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
/*
/myapp
  /node_modules
  /public
    /stylesheets
    /javascripts
    /images
  /routes
    /api
      index.js
      users.js
  /models
    user.js
  /controllers
    userController.js
  app.js
  package.json
*/