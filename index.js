import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import authRoutes from './routes/authentication.routes.js';
import productRoutes from './routes/product.routes.js';

dotenv.config();

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());


app.use('/auth', authRoutes);

app.use('/products', productRoutes);

app.listen(process.env.PORT || 3000, () => {});