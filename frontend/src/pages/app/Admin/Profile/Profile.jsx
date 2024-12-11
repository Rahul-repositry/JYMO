import React, { useState } from "react";
import Logo from "../../../../images/Logo.svg";
import LogOut from "../../../../images/logout.svg";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      let res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/jym/logout`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("You are successfully logut.");
        localStorage.removeItem("adminJym");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error logging out: ", err);
      let msg = err?.response?.data?.message;
      if (msg) {
        toast.error(msg);
      }
    } finally {
      setIsLogoutModalOpen(false);
    }
  };
  return (
    <div className="px-5">
      <div className="jymdetail flex place-items-center py-4">
        <div className="img pr-2">
          <img src={Logo} alt="jymo" className="w-16" />
        </div>
        <div className="details flex flex-col gap-1">
          <h2 className="text-lg">Pro fitness Unisex Jym</h2>
          <p className="text-sm text-gray-600">
            Punjab - Ludhiana - Giaspura- 33_futa_road.
          </p>
          <p className="text-sm text-gray-600">
            9417896284 | 9914568792 | 8875629671
          </p>
        </div>
      </div>
      <div className="link flex flex-col gap-5">
        <Link to="/home">
          <div className="link flex place-content-center bg-customButton py-2 px-3 border border-gray-500 text-white rounded-xl">
            <p className="pl-4 text-lg ">Get to User Home</p>
          </div>
        </Link>
        <Link to="/admin/profile/admins">
          <div className="link flex place-items-center bg-gray-100 py-2 px-3 border border-gray-500 rounded-xl">
            <div className="admin border  border-gray-500 flex place-content-center p-2 rounded-full">
              <div className="img">
                <svg
                  className="w-7 h-7  text-darkBlack 
    group-hover:text-darkBlack"
                  fill="currentColor"
                  viewBox="0 0 17 17"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M14,12.5C14,11.837 13.737,11.201 13.268,10.732C12.799,10.263 12.163,10 11.5,10C9.447,10 6.553,10 4.5,10C3.837,10 3.201,10.263 2.732,10.732C2.263,11.201 2,11.837 2,12.5C2,14.147 2,15 2,15L14,15C14,15 14,14.147 14,12.5ZM12,6L14,6C14.53,6 15.039,6.211 15.414,6.586C15.789,6.961 16,7.47 16,8L16,11L14.663,11C14.101,9.818 12.896,9 11.5,9L10.645,9C11.476,8.267 12,7.194 12,6ZM1.337,11L0,11C0,11 0,9.392 0,8C0,7.47 0.211,6.961 0.586,6.586C0.961,6.211 1.47,6 2,6L4,6C4,7.194 4.524,8.267 5.355,9L4.5,9C3.104,9 1.899,9.817 1.337,11ZM8,3C9.656,3 11,4.344 11,6C11,7.656 9.656,9 8,9C6.344,9 5,7.656 5,6C5,4.344 6.344,3 8,3ZM4.127,4.996C4.085,4.999 4.043,5 4,5C2.896,5 2,4.104 2,3C2,1.896 2.896,1 4,1C4.954,1 5.753,1.67 5.952,2.564C5.061,3.097 4.394,3.966 4.127,4.996ZM10.048,2.564C10.247,1.67 11.046,1 12,1C13.104,1 14,1.896 14,3C14,4.104 13.104,5 12,5C11.957,5 11.915,4.999 11.873,4.996C11.606,3.966 10.939,3.097 10.048,2.564Z" />
                </svg>
              </div>
            </div>
            <p className="pl-4 text-lg">Admin</p>
          </div>
        </Link>
        <Link to="/admin/jymqr">
          <div className="link flex place-items-center bg-gray-100 py-2 px-3 border border-gray-500 rounded-xl">
            <div className="qr border  border-gray-500 flex place-content-center p-2 rounded-full">
              <div className="img">
                <svg
                  width="25px"
                  height="25px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 9h6V3H3zm1-5h4v4H4zm1 1h2v2H5zm10 4h6V3h-6zm1-5h4v4h-4zm1 1h2v2h-2zM3 21h6v-6H3zm1-5h4v4H4zm1 1h2v2H5zm15 2h1v2h-2v-3h1zm0-3h1v1h-1zm0-1v1h-1v-1zm-10 2h1v4h-1v-4zm-4-7v2H4v-1H3v-1h3zm4-3h1v1h-1zm3-3v2h-1V3h2v1zm-3 0h1v1h-1zm10 8h1v2h-2v-1h1zm-1-2v1h-2v2h-2v-1h1v-2h3zm-7 4h-1v-1h-1v-1h2v2zm6 2h1v1h-1zm2-5v1h-1v-1zm-9 3v1h-1v-1zm6 5h1v2h-2v-2zm-3 0h1v1h-1v1h-2v-1h1v-1zm0-1v-1h2v1zm0-5h1v3h-1v1h-1v1h-1v-2h-1v-1h3v-1h-1v-1zm-9 0v1H4v-1zm12 4h-1v-1h1zm1-2h-2v-1h2zM8 10h1v1H8v1h1v2H8v-1H7v1H6v-2h1v-2zm3 0V8h3v3h-2v-1h1V9h-1v1zm0-4h1v1h-1zm-1 4h1v1h-1zm3-3V6h1v1z" />
                  <path fill="none" d="M0 0h24v24H0z" />
                </svg>
              </div>
            </div>
            <p className="pl-4 text-lg">Jym Qr</p>
          </div>
        </Link>
        <Link to="/admin/profile/editjymdetails">
          <div className="link flex place-items-center bg-gray-100 py-2 px-3 border border-gray-500 rounded-xl">
            <div className="qr border  border-gray-500 flex place-content-center p-2 rounded-full">
              <div className="img">
                <svg
                  width="23px"
                  height="23px"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-darkBlack"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z"
                    fill="#0F0F0F"
                  />
                </svg>
              </div>
            </div>
            <p className="pl-4 text-lg">Edit Jym Details</p>
          </div>
        </Link>
        <Link to="/admin/forgotpassword">
          <div className="link flex place-items-center bg-gray-100 py-2 px-3 border border-gray-500 rounded-xl">
            <div className="qr border  border-gray-500 flex place-content-center p-2 rounded-full">
              <div className="img">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-darkBlack"
                  fill="currentColor"
                  width="25px"
                  height="25px"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
              </div>
            </div>
            <p className="pl-4 text-lg">Change Password</p>
          </div>
        </Link>
        <div
          className="link flex place-items-center bg-gray-100 py-2 px-3 border border-gray-500 rounded-xl"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <div className="exit border  border-gray-500 flex place-content-center p-2 rounded-full">
            <div className="img">
              <img src={LogOut} alt="logout" />
            </div>
          </div>
          <p className="pl-4 text-lg">Sign out Jym</p>
        </div>
      </div>

      {/* Logout Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onRequestClose={() => setIsLogoutModalOpen(false)}
        contentLabel="Log Out"
        className="modal-content  mx-5 !max-w-[370px]  rounded-lg
        flex flex-col  gap-2  "
        overlayClassName="modal-overlay"
      >
        <h2 className="text-xl font-medium py-2 text-center">Exit Jym</h2>
        <p className="text-lightBlack text-center">
          Are you sure you want to Exit from Jym?
        </p>
        <div className="buttons pt-4 flex justify-around">
          <button
            className="bg-green-500 px-7 py-2 rounded-lg text-white"
            onClick={handleLogout}
          >
            Yes
          </button>
          <button
            className="bg-red-500 px-7  py-2 rounded-lg text-white"
            onClick={() => setIsLogoutModalOpen(false)}
          >
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
