import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

console.log(process.env.CLOUDINARY_CLOUD_NAME);
cloudinary.config({
  cloud_name: "ds2jxiypq",
  api_key: "242153393434128",
  api_secret: "j_NFQX_BZp33Bz3t3S0yNnESGjw",
});

export default cloudinary;
