import express from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "https://interview-iq-nly3.vercel.app"],
    credentials: true,
}))

import authRouter from './routes/auth.routes.js'; // require all the routes here and use them in the app
import interviewRouter from './routes/interview.routes.js';

// using all the routes here
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

export default app;