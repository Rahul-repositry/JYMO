import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import getCroppedImg from "../utilities/cropImage"; // Utility function to crop the image
import imageCompression from "browser-image-compression";
import "./imageupload.css";
import CustomButton from "../../../../components/Button/Button";
import { toast } from "react-toastify";

Modal.setAppElement("#root"); // Make sure to set the root element for accessibility

const ImageUpload = ({ setPreview }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.size <= 5 * 1024 * 1024 &&
      ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result);
        setIsModalOpen(true);
        // Reset file input value to allow selecting the same file again
        fileInputRef.current.value = null;
      };
    } else {
      toast.error(
        "Please select a valid image file (jpeg, jpg, png) under 5MB."
      );
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const compressedImage = await imageCompression(croppedImage, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
      });

      setPreview(URL.createObjectURL(compressedImage));
      setIsModalOpen(false);
      // Upload compressedImage to Firebase here
    } catch (e) {
      console.error(e);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageSrc(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const CameraIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-camera-fill mr-2"
        viewBox="0 0 16 16"
      >
        <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
        <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
      </svg>
    );
  };

  return (
    <div className="image-upload mb-3">
      <input
        type="file"
        id="selectProfilePhoto"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }} // Hide the file input
      />
      <CustomButton
        icon={CameraIcon}
        onClick={handleButtonClick} // Open the file picker dialog
      >
        Select Profile Pic
      </CustomButton>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {imageSrc && (
          <div className="crop-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}
        <button onClick={handleCrop} className="crop-button">
          Crop
        </button>
        <button onClick={closeModal} className="close-button">
          Close
        </button>
      </Modal>
    </div>
  );
};

export default ImageUpload;
