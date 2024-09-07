import React, { useEffect, useState, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Loader from "../../../components/Loader/Loader";
import axios from "axios";
import {
  getObjectFromLocalStorage,
  setObjectInLocalStorage,
} from "../../../utils/helperFunc";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Reader from "./Reader";
import CameraAccess from "./CameraAccess";

const Scanner = () => {
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [juid, setJuid] = useState("");
  const html5QrCodeRef = useRef(null);
  const readerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
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
        setLoading(false);
      }
    };
    console.log("1st useeffect");
    checkCameraPermission();

    return async () => {
      console.log("unmounting 1st useeffect");
      stopScanner("running on unmounting of 1st useeffecont passing as args");
    };
  }, []);

  const initScanner = useCallback(async () => {
    console.log("beforehtm5qrcoderef");
    console.log({
      cameraAllowed,
      current: html5QrCodeRef.current,
      reader: readerRef.current,
    });
    console.log(location.pathname);
    console.log(html5QrCodeRef?.current?.getState());

    if (!cameraAllowed || !readerRef.current) return;
    // html5QrCodeRef.current = null;
    console.log("afterhtm5qrcoderef");

    html5QrCodeRef.current = new Html5Qrcode(readerRef.current.id);
    html5QrCodeRef.current
      .start(
        { facingMode: "environment" },
        { fps: 5, qrbox: { width: 250, height: 250 } },
        onScanSuccess
      )
      .catch((error) => {
        console.error("Failed to start QR code scanner:", error);
        toast.error("Failed to start QR code scanner.");
      });
  }, [cameraAllowed, readerRef]);

  const reinitializeScanner = useCallback(() => {
    console.log("Reinitializing scanner...");
    setTimeout(() => {
      initScanner();
    }, 1000); // 1-second delay
  }, [initScanner]);

  const markAttendance = useCallback(
    async (jymData) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/api/attendance/regularattendance`,
          { jymId: jymData.jymId },
          { withCredentials: true }
        );

        if (response.data.success) {
          const currentJym = {
            jymId: jymData.jymId,
            jymName: jymData.jymName,
          };
          setObjectInLocalStorage("currentJym", currentJym);

          const myJyms = getObjectFromLocalStorage("myJyms") || [];
          if (!myJyms.some((jym) => jym.jymId === jymData.jymId)) {
            myJyms.push(currentJym);
            setObjectInLocalStorage("myJyms", myJyms);
          }

          toast.success("Attendance marked successfully!");
          stopScanner("Stopping scanner after marking attendance.");
          navigate("/success");
        } else {
          throw new Error(
            response.data.message || "Failed to mark attendance."
          );
        }
      } catch (error) {
        console.error("Error marking attendance:", error);
        toast.error(
          error.response?.data?.message || "Error marking attendance."
        );
      } finally {
        stopScanner(); // Stop the scanner when done
      }
    },
    [navigate]
  );

  const onScanSuccess = useCallback(
    async (decodedText) => {
      try {
        await stopScanner(); // Stop the scanner to avoid multiple scans
        setLoading(true);

        const qrData = JSON.parse(decodedText);
        if (qrData?.app === "jymo") {
          await markAttendance(qrData);
        } else {
          toast.error("Invalid QR code scanned.");
        }
      } catch (error) {
        console.error("Error processing scanned QR code:", error);
        toast.error("Error processing QR code.");
      } finally {
        setLoading(false);
        reinitializeScanner(); // Reinitialize scanner after processing
      }
    },
    [markAttendance, reinitializeScanner]
  );

  // Adjust initScanner to avoid running if cameraAllowed is false

  const stopScanner = useCallback(async (consolelog) => {
    console.log(consolelog);
    if (html5QrCodeRef.current) {
      const state = html5QrCodeRef.current.getState();
      if (state === 2) {
        try {
          await html5QrCodeRef.current.stop();
          await html5QrCodeRef.current.clear();
          html5QrCodeRef.current = null;
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          stream.getTracks().forEach((track) => track.stop());
          console.log("Camera stopped successfully");
          return true;
        } catch (error) {
          console.error("Error stopping QR code scanner:", error);
          return false;
        }
      } else {
        console.log("Scanner is not running, so no need to stop", state);
        return true;
      }
    }
  }, []);

  const handleJUIDinput = (e) => {
    setJuid(e.target.value);
  };

  const markAttendanceByJUID = async () => {
    if (!juid.trim()) {
      toast.error("Please enter a valid JUID.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/jym/getjym/${juid}`,
        { withCredentials: true }
      );

      const jymData = response.data.data;

      if (jymData?._id && jymData?.name) {
        await markAttendance({ jymId: jymData._id, jymName: jymData.name });
      } else {
        throw new Error("Invalid JUID provided.");
      }
    } catch (error) {
      console.error("Error fetching gym data:", error);
      toast.error(error.response?.data?.message || "Error fetching gym data.");
    } finally {
      setLoading(false);
      reinitializeScanner(); // Reinitialize scanner after processing
    }
  };

  // useEffect(() => {
  //   const initializeScannerIfNeeded = () => {
  //     if (cameraAllowed && readerRef.current && !html5QrCodeRef.current) {
  //       console.log("Initializing scanner...");
  //       initScanner();
  //     }
  //   };

  //   // Only initialize the scanner when the camera is allowed
  //   if (cameraAllowed) {
  //     console.log("Camera allowed. Initializing scanner...");
  //     initializeScannerIfNeeded();
  //   }

  //   return () => {
  //     console.log("Cleaning up scanner...");
  //     stopScanner("Cleanup on unmount");
  //   };
  // }, [cameraAllowed, initScanner, stopScanner]);

  // Update the requestCameraPermission function to ensure correct handling

  useEffect(() => {
    if (cameraAllowed && readerRef.current && !html5QrCodeRef.current) {
      reinitializeScanner(); // Reinitialize scanner when camera is allowed
    }

    return () => {
      stopScanner("Cleanup on unmount");
    };
  }, [cameraAllowed, reinitializeScanner, stopScanner]);

  const requestCameraPermission = async () => {
    setLoading(true);
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraAllowed(true);
      toast.success("Camera permission granted.");
    } catch (error) {
      console.error("Camera permission denied:", error);
      setCameraAllowed(false);
      toast.error("Camera permission is required to scan QR codes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scanner-container">
      {loading ? (
        <Loader />
      ) : cameraAllowed ? (
        <Reader
          juidProp={juid}
          markAttendanceByJUID={markAttendanceByJUID}
          handleJUIDinput={handleJUIDinput}
          ref={readerRef}
        />
      ) : (
        <div className="bg-gray-50 border border-gray-700 p-5 text-center rounded-lg mx-4">
          <p>Grant Permission For Camera.</p>
          <button
            onClick={requestCameraPermission}
            className="w-full bg-customButton text-white rounded-lg my-4"
          >
            Allow Camera Permission
          </button>
        </div>
      )}
    </div>
  );
};

export default Scanner;
