import React, { useCallback, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import {
  capitalizeFLetter,
  getObjectFromLocalStorage,
  setObjectInLocalStorage,
} from "../../../../utils/helperFunc";
import { Link, useNavigate } from "react-router-dom";
import edit from "../../../../images/edit.svg";
import male from "../../../../images/male.svg";
import getHelp from "../../../../images/getHelp.svg";
import checklist from "../../../../images/checklist.svg";
import password from "../../../../images/password.svg";
import logOut from "../../../../images/logout.svg";
import arrow from "../../../../images/arrow.svg";
import email from "../../../../images/email.svg";
import phone from "../../../../images/phone.svg";
import axios from "axios";
import { toast } from "react-toastify";

let Options = [
  { logo: checklist, text: "Past Records", link: "/profile/pastrecords" },
  {
    logo: email,
    text: "Change  Gmail",
    link: "/profile/updategmail",
  },
  {
    logo: phone,
    text: "Change Phone-number",
    link: "/profile/updatephone",
  },
  {
    logo: password,
    text: "Forgot Password",
    link: "/forgotpassword",
  },
  {
    logo: getHelp,
    text: "Get Help",
    link: null, // No link for Get Help
  },
  {
    logo: logOut,
    text: "Log Out",
    link: null, // No link for Log Out
  },
];

const Profile = () => {
  const [user, setUser] = useState({
    username: "USERNAME",
    img: process.env.REACT_APP_DEFAULT_IMG,
    phone: "9999999999",
    email: "user@example.com",
    gender: "male",
    isExpired: true,
  });
  const [myJyms, setMyJyms] = useState(null);
  const [currentJym, setCurrentJym] = useState({
    name: "JYM NAME",
    addressLocation: {
      address: "your address",
      city: "city",
      state: "state",
      zipCode: "zipCode",
    },
    phoneNumbers: ["9999999999", "9999999999", "9999999999"],
    owners: ["owner"],
    subscriptionFee: "00",
    jymUniqueId: null,
  });
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const jymDetailCache = useRef(null);
  const navigate = useNavigate();

  const fetchJymDetails = useCallback(async (id) => {
    if (jymDetailCache.current) {
      return jymDetailCache.current;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/jym/getjymbyid/${id}`,
        {
          withCredentials: true,
        }
      );

      const jymData = response.data.jymData;

      return jymData;
    } catch (err) {
      console.error("Error fetching workout plans: ", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      const localUser = getObjectFromLocalStorage("user");
      const jyms = getObjectFromLocalStorage("myJyms");
      const currentJymLocalStorage = getObjectFromLocalStorage("currentJym");

      if (localUser) {
        setUser(localUser);
      } else {
        navigate("/login");
      }

      if (jyms?.length) {
        setMyJyms(jyms);
      }

      if (currentJymLocalStorage?.jymId) {
        const jymData = await fetchJymDetails(currentJymLocalStorage.jymId);
        if (jymData) {
          setCurrentJym(jymData);
        }
      }
    };

    fetchDetails();
  }, [fetchJymDetails, navigate]);

  const handleJymChange = async (e) => {
    const selectedJymId = e.target.value; // Get selected jym's ID
    const newJymData = await fetchJymDetails(selectedJymId); // Fetch gym details based on the ID
    if (newJymData) {
      setObjectInLocalStorage("currentJym", {
        jymId: newJymData._id,
        jymName: newJymData.name,
      });
      setCurrentJym(newJymData); // Update current gym

      window.location.reload();
    }
  };

  const handleLogout = async () => {
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/logout`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("You are successfully logut.");
        localStorage.removeItem("user");
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
    <div>
      <div className="profile bg-yellowBox text-lightBlack">
        <div className="userDetails p-5">
          <div className="userArea flex place-items-center justify-between">
            <div className="imgNDdetails flex gap-5 place-items-center ">
              <div
                className={`img border ${
                  user.isExpired ? "border-redBox" : "border-green-600"
                } border-4  p-[4px] rounded-full`}
              >
                <img
                  src={`${user?.img}`}
                  referrerPolicy="no-referrer"
                  className="rounded-full w-14"
                  alt="jymo"
                />
              </div>
              <div className="detail min-w-0">
                {/* Add min-w-0 here */}
                <div className="nameNDgender flex place-items-center">
                  <h2 className="text-lg font-medium">
                    {capitalizeFLetter(user?.username)}
                  </h2>
                  <div className="svg border border-lightBlack rounded-full mx-3">
                    <img src={male} alt="male" className="w-6" />
                  </div>
                </div>
                <p className="text-stone-500">{user?.phone}</p>
                <p className="text-stone-500 pt-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  {user?.email || "john.doe@gmail.com"}
                </p>
              </div>
            </div>
            <div className="EditButton">
              <Link to="/profile/updateuser">
                {" "}
                <div className="svg border border-lightBlack bg-white rounded-full">
                  <img src={edit} alt="edit" className="min-w-9" />
                </div>
              </Link>
            </div>
          </div>

          {user.isOwner && (
            <Link to="/admin/home">
              <div className="adminButton cursor-pointer border  rounded-lg border-stone-400 my-4 bg-white">
                <p className="flex justify-center   py-2 text-lg font-medium text-stone-600">
                  Admin Panel
                </p>
              </div>
            </Link>
          )}
        </div>
        <div className="line bg-slate-50 w-screen h-[1px]"></div>
        <div className="jymDetails px-5 py-2">
          <div className="top flex justify-between text-sm py-4 ">
            <p className="">Current Jym details -</p>
          </div>
          <div className="middle">
            <div className="jymName text-lg font-medium">
              <h2>{currentJym.name} gym</h2>
            </div>
            <div className="jymAddress text-sm  text-stone-500 pt-1">
              {currentJym.addressLocation ? (
                <p>
                  {currentJym.addressLocation.state} -
                  {currentJym.addressLocation.city} -
                  {currentJym.addressLocation.address}
                </p>
              ) : (
                <p>No Address Available</p>
              )}
            </div>

            <div className="phone flex   py-4">
              <p>{currentJym.phoneNumbers.join(" | ")} </p>
            </div>
          </div>
        </div>
        {myJyms && (
          <>
            <div className="line bg-slate-50 w-screen h-[1px]"></div>
            <div className="jyms px-5 py-8">
              <div className="selectJym">
                <label
                  htmlFor="jyms"
                  className="block mb-2  font-medium py-1 text-lightBlack text-lg "
                >
                  All Recent Jyms
                </label>
                <select
                  id="jyms"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customButton focus:border-customButton block w-full p-2.5"
                  onChange={handleJymChange}
                >
                  <option defaultValue={currentJym.name} disabled>
                    {currentJym.name}
                  </option>

                  {myJyms.map((jym) => {
                    return (
                      <option key={jym.jymId} value={`${jym.jymName}`}>
                        {jym.jymName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="options px-4 flex flex-col gap-4 py-5">
        {Options.map((data) => {
          if (data.text === "Get Help") {
            return (
              <div
                className={`${data.text} flex  place-items-center cursor-pointer`}
                key={data.text}
                onClick={() => setIsHelpModalOpen(true)}
              >
                <div className="svg">
                  <img src={data.logo} alt={data.text} />
                </div>
                <div className="pastContainer pl-3  flex-grow">
                  <div className="arrowNDText flex justify-between  place-items-center">
                    <p>{data.text}</p>
                    <img src={arrow} alt="arrow" className=" rotate-180 w-9" />
                  </div>
                  <div className="line bg-slate-300 h-[1px] w-full"></div>
                </div>
              </div>
            );
          } else if (data.text === "Log Out") {
            return (
              <div
                className={`${data.text} flex  place-items-center cursor-pointer`}
                key={data.text}
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <div className="svg">
                  <img src={data.logo} alt={data.text} />
                </div>
                <div className="pastContainer pl-3  flex-grow">
                  <div className="arrowNDText flex justify-between  place-items-center">
                    <p>{data.text}</p>
                    <img src={arrow} alt="arrow" className=" rotate-180 w-9" />
                  </div>
                  <div className="line bg-slate-300 h-[1px] w-full"></div>
                </div>
              </div>
            );
          } else {
            return (
              <Link to={data?.link} key={data.text}>
                <div
                  className={`${data.text} flex  place-items-center cursor-pointer`}
                >
                  <div className="svg">
                    <img src={data.logo} alt={data.text} />
                  </div>
                  <div className="pastContainer pl-3  flex-grow">
                    <div className="arrowNDText flex justify-between  place-items-center">
                      <p>{data.text}</p>
                      <img
                        src={arrow}
                        alt="arrow"
                        className=" rotate-180 w-9"
                      />
                    </div>
                    <div className="line bg-slate-300 h-[1px] w-full"></div>
                  </div>
                </div>
              </Link>
            );
          }
        })}
      </div>

      {/* Help Modal */}
      <Modal
        isOpen={isHelpModalOpen}
        onRequestClose={() => setIsHelpModalOpen(false)}
        contentLabel="Get Help"
        className="modal-content  mx-5 !max-w-[370px]  rounded-lg
         flex flex-col gap-2 place-items-center "
        overlayClassName="modal-overlay"
      >
        <h2 className="text-xl font-medium py-2">Get Help ?</h2>
        <p className="text-lightBlack text-center">
          For any query, message us at 9877434656 <br />
          OR <br />
          <a
            href="mailto:jyymmoo@gmail.com"
            className="text-xl font-bold cursor-pointer text-customButton"
          >
            jyymmoo@gmail.com
          </a>
        </p>
        <button
          onClick={() => setIsHelpModalOpen(false)}
          className="bg-red-400 w-full rounded-lg text-white my-2 py-2"
        >
          Close
        </button>
      </Modal>

      {/* Logout Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onRequestClose={() => setIsLogoutModalOpen(false)}
        contentLabel="Log Out"
        className="modal-content  mx-5 !max-w-[370px]  rounded-lg
        flex flex-col  gap-2  "
        overlayClassName="modal-overlay"
      >
        <h2 className="text-xl font-medium py-2 text-center">Log Out</h2>
        <p className="text-lightBlack text-center">
          Are you sure you want to log out?
        </p>
        <div className="buttons pt-4 flex justify-around">
          <button
            className="bg-green-500 px-8  py-3 rounded-lg text-white"
            onClick={handleLogout}
          >
            Yes
          </button>
          <button
            className="bg-red-500 px-7 rounded-lg text-white"
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
