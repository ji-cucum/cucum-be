import  express from 'express';
import bodyParser from 'body-parser';
import playlistRouter from './routes/playlistRouter.js';
const app = express()
const port = 3000

app.use(bodyParser.json());
app.use('/api/playlist', playlistRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})