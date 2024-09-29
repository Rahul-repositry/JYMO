import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "react-toastify";
import axios from "axios";
import {
  getObjectFromLocalStorage,
  setObjectInLocalStorage,
} from "../../../utils/helperFunc";
import { useNavigate } from "react-router-dom";
import Reader from "./Reader";

function Scanner({ setLoading }) {
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate();
  const readerRef = useRef(null);
  const juidRef = useRef("");
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

          toast.success(response.data.message);
          stopScanner();
          navigate("/scanner/success");
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

  const handleJUIDinput = (e) => {
    juidRef.current = e.target.value;
  };

  const reinitializeScanner = useCallback(() => {
    setTimeout(() => {
      initScanner();
    }, 1000); // 1-second delay
  }, []);

  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      } catch (error) {
        console.error("Error stopping QR code scanner:", error);
      }
    }
  }, []);

  //
  const onScanSuccess = useCallback(
    async (decodedText) => {
      try {
        setLoading(true);
        await stopScanner(); // Stop the scanner to avoid multiple scans
        const qrData = JSON.parse(decodedText);
        // && qrData?.jymId && qrData?.jymName
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
    [markAttendance, reinitializeScanner, setLoading, stopScanner]
  );

  const initScanner = useCallback(async () => {
    if (!readerRef.current || html5QrCodeRef.current) return;

    html5QrCodeRef.current = new Html5Qrcode(readerRef?.current.id || "reader");
    try {
      // Access camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());

      // streamRef.current = stream; // Store the stream reference

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess
      );
    } catch (error) {
      console.error("Failed to start QR code scanner:", error);
    }
  }, [onScanSuccess]);

  const markAttendanceByJUID = useCallback(async () => {
    if (!juidRef?.current?.trim()) {
      toast.error("Please enter a valid JUID.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/jym/getjym/${juidRef.current}`,
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
  }, []);

  useEffect(() => {
    reinitializeScanner();

    return () => {
      if (html5QrCodeRef.current) {
        stopScanner();
      }
    };
  }, []);

  return (
    <>
      <Reader
        juidProp={juidRef.current}
        markAttendanceByJUID={markAttendanceByJUID}
        handleJUIDinput={handleJUIDinput}
        ref={readerRef}
      />
    </>
  );
}

export default Scanner;
