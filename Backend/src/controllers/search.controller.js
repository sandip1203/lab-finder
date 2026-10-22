import { readFile } from "node:fs/promises"

export async function getTests(req,res)
{
    const data = await readFile(new URL ("../../data/lab-catalog.json",import.meta.url),"utf-8")
    const tests = JSON.parse(data).tests
    res.status(200).json({
        message:"tests fetch successfully",
        test:tests
    })
}

export async function getPackages(req,res){
    const data = await readFile(new URL("../../data/lab-catalog.json",import.meta.url),"utf-8")
    const pacakages = JSON.parse(data).packages
    res.status(200).json({
        message:"pacakges fetch successfully",
        test:pacakages
    })
}

export async function search (req,res) {
    try   {const name = req.query.name
        if (!name || typeof name!=="string"){
            return res.status(400).json({
                message:"plase enter a word to search"
            })
        }
        const file = await readFile(new URL("../../data/lab-catalog.json",import.meta.url),"utf-8")
        const data = JSON.parse(file).tests
        console.log(data)
        const result = data.filter((val)=>{
            return val.name.toLowerCase().includes(name.trim().toLowerCase())
        })
        console.log(result)
        return res.status(200).json(result)}
    catch(error){
        return res.status(500).json({
            message:"Something went wrong"
        })
    }
}