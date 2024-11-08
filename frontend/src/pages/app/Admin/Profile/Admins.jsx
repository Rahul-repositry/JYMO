import axios from "axios";
import React, { useEffect, useState } from "react";
import { getObjectFromLocalStorage } from "../../../../utils/helperFunc";

const Admins = () => {
  const jymDetails = getObjectFromLocalStorage("adminJym");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/api/user/getusersthroughid`,
          { userIdArr: jymDetails.owners },
          { withCredentials: true }
        );

        console.log(res);
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="px-5">
      <h2 className="text-xl pt-5">Admins</h2>
      <p className="text-gray-500 py-1">All admins of your Jym </p>

      <div className="admins pt-5">
        {users.map((userObj) => (
          <div
            className="admin flex border border-gray-500 py-4 rounded-2xl px-3"
            key={userObj._id}
          >
            <div className="img w-12 ">
              <img
                src={userObj.img || process.env.REACT_APP_DEFAULT_IMG}
                alt="jymo user"
                className="border border-gray-400 rounded-full "
              />
            </div>
            <div className=" pl-4 details">
              <h3 className="text-lg">{userObj.username}</h3>
              <p className="text-sm text-gray-500">{userObj.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admins;
