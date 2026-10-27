import { getRecommendation } from "../services/recommendation.service.js"

export async function recommendationController(req, res) {
    try {
        const result = await getRecommendation(req.body?.testIds)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}
