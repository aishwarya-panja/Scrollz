import axios from "axios";

export const uploadImage = async (img) => {
  let imgUrl = null;

  const serverDomain =
    import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:3000";

  await axios
    .get(serverDomain + "/get-upload-url")
    .then(async ({ data: { uploadURL } }) => {
      console.log("Generated Upload URL: ", uploadURL); // Log the uploadURL for debugging

      await axios({
        method: "PUT",
        url: uploadURL,
        headers: { "Content-Type": "multipart/form-data" },
        data: img,
      })
        .then(() => {
          imgUrl = uploadURL.split("?")[0];
        })
        .catch((error) => {
          console.error("Error fetching upload URL: ", error);
        });
    });

  return imgUrl;
};
