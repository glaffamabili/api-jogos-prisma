import express from 'express';
import 'express-async-errors';
import generosRouter from './routes/generos';
import plataformasRouter from './routes/plataformas';
import jogosRouter from './routes/jogos';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(express.json());

app.use('/generos', generosRouter);
app.use('/plataformas', plataformasRouter);
app.use('/jogos', jogosRouter);

app.use(errorHandler);

export default app;
