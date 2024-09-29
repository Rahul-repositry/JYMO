import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import InputField from "../../../components/InputFeild/InputField";
import {
  getObjectFromLocalStorage,
  setObjectInLocalStorage,
} from "../../../utils/helperFunc";
import ImageUpload from "../SignIn/components/ImageUpload";
import Modal from "react-modal";
import BirthDate from "../SignIn/components/Birthday.jsx";

const UpdateUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const localUser = getObjectFromLocalStorage("user");
  const defaultImg = process.env.REACT_APP_DEFAULT_IMG;
  const [preview, setPreview] = useState(localUser?.img || defaultImg);
  const [showDelete, setShowDelete] = useState(false);

  const [isUploading, setIsUploading] = useState(false); // Prevent multiple requests
  const [formData, setFormData] = useState({
    name: localUser.username || "",
    birthday: localUser.birthday || "",
  });

  useEffect(() => {
    setShowDelete(shouldShowDelete(preview));
  }, [preview]);

  const shouldShowDelete = (url) => {
    return Boolean(
      url &&
        !url.includes("lh3.googleusercontent.com") &&
        url.includes("jymo.s3") &&
        url !== defaultImg
    );
  };

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/user`,
        { withCredentials: true, headers: { "Cache-Control": "no-cache" } }
      );
      if (data.success) setObjectInLocalStorage("user", data.user);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleImgUpload = async () => {
    if (isUploading || preview === defaultImg || preview === localUser?.img)
      return;
    setIsUploading(true);
    try {
      const imageFile = await fetch(preview).then((res) => res.blob());
      const { data: uploadData } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/getputurltoken`,
        null,
        { withCredentials: true }
      );
      const { url, key } = uploadData;
      await axios.put(url, imageFile, {
        headers: { "Content-Type": imageFile.type },
      });
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/updateuserimg`,
        { imgKey: key },
        { withCredentials: true }
      );
      if (data.success) {
        const updatedUser = await fetchUserDetails();
        if (updatedUser.success) {
          toast.success("Image changed successfully.");
          setPreview(updatedUser.user.img);
          setShowDelete(true);
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImgDelete = async () => {
    try {
      if (preview === defaultImg) return toast.error("No image to delete.");
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/deleteimg`,
        { withCredentials: true, params: { imgUrl: preview } }
      );
      if (res.data.success) {
        setPreview(defaultImg);
        setObjectInLocalStorage("user", { ...localUser, img: "" });
        toast.success("Image deleted successfully.");
        setShowDelete(false);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error deleting image.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.birthday) return toast.error("Please select Birthdate.");

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/updateusernameandbday`,
        formData,
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("User updated successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal-content mx-5"
        overlayClassName="modal-overlay"
      >
        <div className="text-center py-4">
          <p className="text-xl font-bold">
            Do you really want to delete this image?
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleImgDelete}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Delete
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </Modal>

      <div className="max-w-screen-md mx-auto px-5 pt-5">
        <h2 className="text-2xl font-semibold mb-4">Update User Details</h2>
        <div className="flex flex-col items-center gap-4">
          <img
            src={preview}
            alt="User"
            className="w-24 h-24 rounded-xl bg-gray-300"
            style={{ boxShadow: "0px 7px 20px 0px rgba(0,0,0,.2)" }}
          />
          {showDelete && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Delete Img
            </button>
          )}
          {preview !== localUser?.img && preview !== defaultImg && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleImgUpload}
                disabled={isUploading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Upload
              </button>
              <button
                onClick={() => setPreview(localUser?.img || defaultImg)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          )}
          {!showDelete && <ImageUpload setPreview={setPreview} />}
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 mt-5">
          <InputField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <BirthDate setFormData={setFormData} />
          <button
            type="submit"
            className="bg-customButton text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateUser;
