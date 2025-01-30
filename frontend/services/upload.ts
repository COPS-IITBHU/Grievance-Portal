import axios from "axios";

const cloud_name = process.env.NEXT_PUBLIC_CLOUD_NAME;
const cloud_secret = process.env.NEXT_PUBLIC_CLOUD_SECRET;
if (!cloud_name || !cloud_secret) {
  throw new Error("Cloudinary configuration is missing");
  // console.log("Cloudinary configuration is missing");
}

export const uploadFiles = async (files: any) => {
  let formData = new FormData();
  if (cloud_secret) {
    formData.append("upload_preset", cloud_secret);
  } else {
    throw new Error("Cloudinary upload secret is missing");
  }
  let uploaded = [];
  for (const f of files) {
    const { file } = f;
    formData.append("file", file);
    let res = await uploadToCloudinary(formData);
    uploaded.push(res);
  }
  return uploaded;
};

export const uploadToCloudinary = async (formData: any) => {
  console.log(cloud_name, cloud_secret);
  return new Promise(async (resolve) => {
    return await axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`,
        formData
      )
      .then(({ data }) => {
        resolve(data.secure_url);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
