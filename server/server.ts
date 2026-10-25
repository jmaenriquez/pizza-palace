import "dotenv/config";
import  express  from "express";
import cors from 'cors'

import productRouter from './src/routes/productRouter'
import cartRouter from './src/routes/cartRouter'
import userRouter from './src/routes/userRouter'
import addressRouter from './src/routes/addressRouter'
import checkOutRouter from './src/routes/checkOutRouter'

const app = express();
const port = Number(process.env.PORT) || 3000
const allowedOrigin = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim());

app.use(cors({
    origin: allowedOrigin,
    
}));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use(productRouter);
app.use(cartRouter);
app.use(userRouter);
app.use(addressRouter);
app.use(checkOutRouter);

app.get('/', (_,res) => {
    res.send('Hello From Express Backend');
});

app.listen(port,()=> {
    console.log(`Server is running on port ${port}`);
});
