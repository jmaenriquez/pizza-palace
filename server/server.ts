import  express  from "express";
import cors from 'cors'

import userRoutes from './src/routes/userRoutes'

const app = express();
const port = 3000

app.use(cors({
    origin: 'localhost:5173/',
    credentials: true
}))

app.use(express.json());
app.use(userRoutes);


app.get('/', (_,res) => {
    res.send('Hello From Express Backend');
});

app.listen(port,()=> {
    console.log(`Server is running on port ${port}`);
});
