import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());



app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});




