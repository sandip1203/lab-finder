import express from "express"
import searchRouter from "./routes/search.routes.js"
import cors from "cors";


const app = express()
app.use(cors());

app.use(express.json())


app.use("/",searchRouter)


export default app