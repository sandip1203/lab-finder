import { Router } from "express"
import { getTests ,getPackages,search} from "../controllers/search.controller.js";
import { recommendationController } from "../controllers/recommendation.controller.js";


const searchRouter = Router();

searchRouter.get("/tests", getTests)

/*
* -GET /packages
*/

searchRouter.get("/packages",getPackages)

/*
* -GET /search
*/

searchRouter.get("/search",search)


/*
* -POST /recommendation
*/

searchRouter.post("/recommendation", recommendationController)



export default searchRouter