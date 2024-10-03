import React, { useEffect, useState } from "react";
import CameraAccess from "./CameraAccess";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";

const ScannerProtected = ({ children }) => {
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setCameraAllowed(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error("Camera permission denied:", error);
        setCameraAllowed(false);
        toast.error("Camera permission is required to scan QR codes.");
      } finally {
        setLoading(false); // Set loading to false once permission check is done
      }
    };

    checkCameraPermission();

    return () => {};
  }, []);

  const requestCameraPermission = async () => {
    try {
      const permissionObj = await navigator.permissions.query({
        name: "camera",
      });

      if (permissionObj.state === "granted") {
        setCameraAllowed(true);
        toast.success("Camera permission granted.");
      } else if (permissionObj.state === "denied") {
        setCameraAllowed(false);
        toast.error(
          "Camera permission denied. Please enable it in your browser settings. Follow below guidelines "
        );
      } else if (permissionObj.state === "prompt") {
        setCameraAllowed(false);
        toast.info(
          "Camera permission is required to scan QR codes. Please allow when prompted."
        );
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            stream.getTracks().forEach((track) => track.stop());
            setCameraAllowed(true);
            toast.success("Camera permission granted.");
          })
          .catch((error) => {
            setCameraAllowed(false);
            toast.error("Camera permission is required to scan QR codes.");
            console.log("Got error during getUserMedia:", error);
          });
      }
    } catch (error) {
      console.error("Camera permission denied:", error);
      setCameraAllowed(false);
      toast.error("Camera permission is required to scan QR codes.");
    }
  };

  return (
    <div className="">
      {loading ? (
        <Loader /> // Show loader while checking camera permission
      ) : cameraAllowed ? (
        <div className="">{React.cloneElement(children, { setLoading })}</div>
      ) : (
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <CameraAccess requestCameraPermission={requestCameraPermission} />
        </div>
      )}
    </div>
  );
};

export default ScannerProtected;
