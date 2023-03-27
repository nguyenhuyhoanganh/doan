import React, { useState } from "react";
import axios from "axios";
import * as icons from "../../utils/icons";
import * as apis from "../../apis";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SearchByVoice = () => {
  const navigate = useNavigate();
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
        // console.log(response.data?.metadata?.music[0]?.title);
        return response.data?.metadata?.music[0]?.title;
      })
      .then((response) => {
        // console.log(response)
        if (response === undefined) {
          toast.warning("Không tìm thấy bài hát");
        } else {
          navigate(`/search/${response}`);
        }
        return response;
      })
      .catch((err) => {
        // cb(err);
        console.log(err);
      });
  };

  const identify_song = (file) => {
    indentify(file, defaultOptions, function (err, httpResponse, body) {
      if (err) console.log(err);
      console.log(body);
    });
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleSearch = async () => {
    console.log("searching...");
    identify_song(selectedFile);
  };
  return (
    <div className="flex flex-col gap-5 m-auto items-center py-[100px] text-center">
      <div>Icon</div>
      <div className="flex flex-col gap-2">
        <span>Chọn file nhạc cần biết tên:</span>
        <input
          type="file"
          accept=".mp3"
          className="px-4 py-2 mb-4 text-gray-700 bg-main-300 rounded-lg shadow-md focus:outline-none focus:shadow-outline"
          onChange={handleFileInputChange}
        />
      </div>
      <button
        onClick={handleSearch}
        className="border border-[#276a6c] rounded-md hover:bg-main-400 px-10 py-1"
      >
        Tìm tên bài hát
      </button>
    </div>
  );
};

export default SearchByVoice;
