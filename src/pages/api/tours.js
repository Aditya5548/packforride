import { connectDB } from '../../lib/config/db';
import jwt from 'jsonwebtoken';
import formidable from 'formidable';
import path from 'path';
import Tourplace from '../../lib/models/TourlistModel';
const fs = require('fs');
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await connectDB();
  if (req.method === 'GET') {
    try {
      const decoded = jwt.verify(req.query.token, process.env.NEXT_PUBLIC_API_URL)
      if (decoded.id === process.env.NEXT_PUBLIC_SECRET_KEY) {
          const blogs = await Tourplace.find({}).sort({ _id: -1 });
          return res.status(200).json(blogs);
      } else {
        return res.status(200).json({msg:"Unauthorised API Access"});
      }
    }
    catch (error) {
      return res.status(200).json({msg:"Unauthorised API Access"});
    }
  }

  if (req.method === 'POST') {
    const form = formidable({ multiples: false, uploadDir: './public', keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        const decoded = jwt.verify(fields.token[0], process.env.NEXT_PUBLIC_API_URL)
        try {
          const imageFile = files.image?.[0];
          const fileName = path.basename(imageFile.filepath);
          const imgUrl = `/${fileName}`;
          const Tour = {
            tourname: fields.tourname?.[0],
            description: fields.description?.[0],
            category: fields.category?.[0],
            image: imgUrl,
            transport: fields.transport?.[0],
            room: fields.room?.[0],
            fooding: fields.fooding?.[0],
            location: fields.location?.[0],
            tourhostname: "Aditya kumar Yadav",
            tourhostid: "3989fiidsjfij", 
          };
          const response = await Tourplace.create(Tour);
          return res.status(200).json({ status: 'success', msg: response });

        }
        catch (error) {
          return res.status(200).json({ status: 'failed', msg: "image is not uploaded" ,err:error});
        }
      }
      catch (e) {
        return res.status(200).json({ status: 'failed', msg: "Invaild Login Credential"});
      }
    });
  }

  if (req.method === 'DELETE') {
    try {
      const decoded = jwt.verify(req.query.token, process.env.NEXT_PUBLIC_API_URL)
      const _id = req.query.id;
      // Removing image from public folder
      const blog = await Tourplace.findById(_id);
      fs.unlink(`./public${blog.image}`, () => { });
      // Removing image from public folder

      await Tourplace.findByIdAndDelete(_id);
      return res.status(200).json({ msg: "Blog Deleted" });
    }
    catch (e) {
      return res.status(200).json({ status: 'failed', msg: "Invaild Login Credential" });
    }
  }
}

