import  express  from "express";
import cors from 'cors'

import productRouter from './src/routes/productRouter'
import cartRouter from './src/routes/cartRouter'
import userRouter from './src/routes/userRouter'
import addressRouter from './src/routes/addressRouter'
import checkOutRouter from './src/routes/checkOutRouter'

const app = express();
const port = 3000 // replace with render's port

app.use(cors({
    origin: 'http://localhost:5173',
    // origin: 'http://vercel_link.app'
    
}))

app.use(express.json());
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
