import express from "express"
import searchRouter from "./routes/search.routes.js"

const app = express()
app.use(express.json())

app.use("/",searchRouter)


export default app