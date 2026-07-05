import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFound from './middlewares/notFound';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import router from './routes';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Apollo Gears World!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
