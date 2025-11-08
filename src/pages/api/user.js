import { connectDB } from '../../lib/config/db';
import userModel from '../../lib/models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
const createtoken = (id) => {
    return jwt.sign({ id }, process.env.NEXT_PUBLIC_API_URL);
}
export default async function handler(req, res) {
    if (req.method === "GET") {
        if (req.query.email && req.query.password) {
            const { email, password } = req.query
            if (email && password) {
                const user = await userModel.findOne({ email })
                if (!user) {
                    return res.status(200).json({ success: false, msg: "user not exists" });
                }
                else {
                    const isMatch = await bcrypt.compare(password, user.password)
                    if (!isMatch) {
                        return res.status(200).json({ success: false, msg: "incorrect password" });
                    }
                    else {
                        const token = createtoken(user._id)
                        return res.status(200).json({ success: true, msg: "Login Successfull", usertoken: token, username: user.name });
                    }

                }
            }
            else {
                return res.status(200).json({ success: false, msg: "error occurred" });
            }

        } 
        if(req.query.token){
            const decoded = jwt.verify(req.query.token, process.env.NEXT_PUBLIC_API_URL)
            const user = await userModel.findById(decoded.id)
            return res.status(200).json({ success: true, username: user.name});
        }

    }
    if (req.method === 'POST') {
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(req.body.password, salt)
        try {
            if (req.body.email) {
                const data = {
                    name: req.body.name,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    email: req.body.email,
                    phoneno: req.body.phoneno,
                    password: hashedpassword
                }
                const newuser = new userModel(data)
                const userreturn = await newuser.save()
                const token = createtoken(userreturn._id)
                console.log("token", token)
                return res.status(200).json({ success: true, msg: "Login Successfull", usertoken: token, username: userreturn.name });
            }
            else {
                return res.status(200).json({ success: false, msg: "All Field required" });
            }
        } catch (error) {
            console.log(error)
            return res.status(200).json({ success: false, msg: "Error Occured" });
        }

    }
}