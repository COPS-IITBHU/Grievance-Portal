import axios from "axios";

const cloud_name = process.env.REACT_APP_CLOUD_NAME as string;
const cloud_secret = process.env.REACT_APP_CLOUD_SECRET as string;

export const uploadFiles = async (files: any) => {
  let formData = new FormData();
  formData.append("upload_preset", cloud_secret);
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
