import express from 'express';
import cors from 'cors';

const app = express();

const routes = require('./routes');
app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true,
}));

app.use(express.json());
app.use('/api', routes);

export default app;