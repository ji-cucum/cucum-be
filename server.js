import  express from 'express';
import bodyParser from 'body-parser';
import playlistRouter from './routes/playlistRouter.js';
import cors from 'cors';
const app = express()
const port = 3011

app.use(bodyParser.json());
app.options("*", cors({ origin: 'http://localhost:5173', optionsSuccessStatus: 200 }));
app.use(cors({ origin: "http://localhost:5173", optionsSuccessStatus: 200 }));
app.use('/api/playlist', playlistRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})