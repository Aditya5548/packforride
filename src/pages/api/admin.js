import jwt from  'jsonwebtoken';
const createtoken = (id) => {
    return jwt.sign({id}, process.env.NEXT_PUBLIC_API_URL);
}
export default async function handler(req, res) {
    if (req.method === "GET") {
        const admindata ={userid:'Aditya9377',password:'12345678'}
        const logdata = req.query
        if (admindata.userid === logdata.userid && admindata.password === logdata.password) {
            const token=createtoken(logdata.userid)
            return res.status(200).json({success:true,authkey:token});
        } else {
            return res.status(200).json({success:false,msg:"invalid login data"});
        }
    }
}