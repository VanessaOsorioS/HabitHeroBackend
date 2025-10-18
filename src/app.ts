import express from 'express';
const app = express();

const routes = require('./routes');

app.use(express.json());
app.use('/api', routes);

export default app;