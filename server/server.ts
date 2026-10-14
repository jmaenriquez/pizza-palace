import  express  from "express";
import cors from 'cors'

import productRoutes from './src/routes/productRoutes'
import cartRoutes from './src/routes/cartRouter'

const app = express();
const port = 3000

app.use(cors({
    origin: 'http://localhost:5173',
    
}))

app.use(express.json());
app.use(productRoutes);
app.use(cartRoutes);


app.get('/', (_,res) => {
    res.send('Hello From Express Backend');
});

app.listen(port,()=> {
    console.log(`Server is running on port ${port}`);
});
