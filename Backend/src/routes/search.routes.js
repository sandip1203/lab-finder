import { Router } from "express"
import { readFile } from "node:fs/promises"
import { getTests ,getPackages,search} from "../controllers/search.controller.js";
import { recommendation_data } from "../controllers/recommendation.controller.js";


const searchRouter = Router();



searchRouter.get("/tests",getTests)

searchRouter.get("/packages",getPackages)


searchRouter.get("/search",search)







searchRouter.post("/recommendation", recommendation_data)



export default searchRouter