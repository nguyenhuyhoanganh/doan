import axios from "../axios";
import CryptoJS from "crypto-js";

const defaultOptions = {
  host: "identify-ap-southeast-1.acrcloud.com",
  endpoint: "/v1/identify",
  signature_version: "1",
  data_type: "audio",
  secure: true,
  access_key: "1d6495f3c67576fbafb7de3c36d18774",
  access_secret: "VM4R4r3bmFxfIiYzdRatgFjg7vXaKNPQE0ddPA0z",
};

const builStringToSign = (
  method,
  uri,
  accessKey,
  dataType,
  signatureVersion,
  timestamp
) => {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join(
    "\n"
  );
};

const sign = (signString, accessSecret) => {
  const signature = CryptoJS.HmacSHA1(signString, accessSecret);
  return CryptoJS.enc.Base64.stringify(signature);
};

const indentify = (data, options) => {
  const current_data = new Date();
  const timestamp = current_data.getTime() / 1000;

  const stringToSign = builStringToSign(
    "POST",
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp
  );
  const signature = sign(stringToSign, options.access_secret);

  const formData = new FormData();
  formData.append("sample", data);
  formData.append("access_key", options.access_key);
  formData.append("data_type", options.data_type);
  formData.append("signature_version", options.signature_version);
  formData.append("signature", signature);
  formData.append("sample_bytes", data.lenght);
  formData.append("timestamp", timestamp);

  axios
    .post(`http://${options.host}${options.endpoint}`, formData)
    .then((response) => {
      // cb(null, response.data);
      console.log(response.data?.metadata?.music[0]?.title);
      return response.data
    })
    .catch((err) => {
      // cb(err);
      console.log(err)
    });
};

export const identify_song = (file) => {
  indentify(file, defaultOptions, function (err, httpResponse, body) {
    if (err) console.log(err);
    console.log(body);
  });
};

export const apiGetSong = (sid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/song",
        method: "GET",
        params: { id: sid },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetDetailSong = (sid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/songs",
        method: "GET",
        params: { id: sid },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetDetailPlaylist = (pid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "/detailplaylist",
        method: "GET",
        params: { id: pid },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apigetSongsByAlbumId = (aid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `songs?album.id=${aid}`,
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetAlbumDetail = (aid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "albums",
        method: "GET",
        params: { id: aid },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetCommentBySId = (sid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `song/${sid}/comments`,
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetComposers = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "composers?sortBy=id&page=1&limit=50",
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetArtists = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "artists?sortBy=followCount&page=1&limit=50",
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetArtistBySlug = (slug) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `artists?slug=${slug}`,
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetSongsByArtistId = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: `songs?artists.id=${id}`,
        method: "GET",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
