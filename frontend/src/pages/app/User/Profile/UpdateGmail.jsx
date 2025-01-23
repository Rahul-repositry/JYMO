import React, { useEffect, useState } from "react";
import Gauth from "../../../../components/Gauth/Gauth";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { useNavigate } from "react-router";

const UpdateGmail = () => {
  const [updateData, setUpdateData] = useState({
    firebaseEmailIdToken: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const updateUserEmail = async () => {
      if (updateData.firebaseEmailIdToken && confirmed) {
        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URI}/api/user/updateuseremail`,
            updateData,
            { withCredentials: true }
          );
          if (data.success) {
            toast.success("User Gmail updated successfully!");
            navigate("/profile");
          }
        } catch (error) {
          toast.error(
            error?.response?.data?.message ||
              "An error occurred. Please try again."
          );
        }
        setConfirmed(false); // Reset confirmation state after action
      }
    };

    updateUserEmail();
  }, [updateData, confirmed]);

  // Function to handle confirmation
  const confirmChange = () => {
    setShowModal(true);
  };

  // Function to handle modal close and confirmation
  const handleConfirm = () => {
    setShowModal(false);
    setConfirmed(true); // Set confirmation to true and trigger email update
  };

  return (
    <div className="mx-5">
      <div className="heading">
        <h2 className="text-2xl font-semibold mb-4 text-lightBlack my-3">
          Update User Gmail
        </h2>
      </div>
      <Gauth setUpdateData={setUpdateData} confirmChange={confirmChange} />

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Confirm Gmail Change"
        className="modal-content mx-5 !max-w-[370px]  rounded-xl flex flex-col place-items-center "
        overlayClassName="modal-overlay"
      >
        <h2 className="text-xl font-semibold">Confirm Gmail Change</h2>
        <p className="py-3 text-lg text-center">
          Are you sure you want to update your Gmail?
        </p>
        <div className="modal-actions flex  gap-5">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateGmail;
