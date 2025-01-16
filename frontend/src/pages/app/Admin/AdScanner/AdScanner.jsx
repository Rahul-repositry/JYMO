import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "react-toastify";
import axios from "axios";
import snd from "../../../../images/snd.svg";
import { useNavigate } from "react-router-dom";
import Reader from "./AdReader";
import Loader from "../../../../components/Loader/Loader";

function AdScanner() {
  const html5QrCodeRef = useRef(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();
  const readerRef = useRef(null);
  const uuidRef = useRef("");
  uuidRef.current = "";

  const chqMembershipStatus = useCallback(
    async (userData) => {
      // try {
      //   const response = await axios.post(
      //     `${process.env.REACT_APP_BACKEND_URI}/api/membership?userId=${userData.userId}`,
      //     { withCredentials: true }
      //   );

      //   if (response.data.success) {
      //     toast.success(response.data.message);
      //     navigate(`/admin/member?userId=${userData.userId}`);
      //     stopScanner();
      //   } else {
      //     throw new Error(
      //       response.data.message || "Use buttons to configure membership"
      //     );
      //   }
      // } catch (error) {
      //   console.error("Error configuring membership:", error);
      //   toast.error(
      //     error.response?.data?.message || "Error configuring membership"
      //   );
      // } finally {
      //   stopScanner(); // Stop the scanner when done
      // }
      stopScanner();
      navigate(`/admin/member?userId=${userData.userId}`);
      return;
    },
    [navigate]
  );

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
        if (qrData?.app === "jymo" && qrData?.role === "owner") {
          await chqMembershipStatus(qrData);
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
    [chqMembershipStatus, reinitializeScanner, setLoading, stopScanner]
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
    } finally {
      setLoading(false);
    }
  }, [onScanSuccess]);

  useEffect(() => {
    reinitializeScanner();
    setLoading(false);

    return () => {
      if (html5QrCodeRef.current) {
        stopScanner();
        setLoading(false);
      }
    };
  }, []);
  const handleUUIDinput = (e) => {
    uuidRef.current = e.target.value;
  };
  const navigateUUID = useCallback(async () => {
    if (!uuidRef?.current.trim()) {
      toast.error("Please enter a valid UUID.");
      return;
    }

    navigate(`/admin/member?userUniqueId=${uuidRef.current}`);
    return;
  }, []);

  const deactiveMember = async () => {
    try {
      if (!uuidRef?.current || !uuidRef?.current?.trim()) {
        toast.error("Please enter a valid UUID.");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/attendance/inactive`,
        { userUniqueId: uuidRef.current },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error configuring membership:", error);
      toast.error(
        error.response?.data?.message || "Error deactivating membership"
      );
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Reader ref={readerRef} />
          <div className=" inputCont w-72 mx-auto rounded-full border border-blue-gray-300 bg-transparent flex place-items-center justify-around px-2">
            <div className="  text-blue-gray-500">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <rect
                  x="0.25"
                  y="0.25"
                  width="23.5"
                  height="23.5"
                  rx="11.75"
                  fill="#F5F5F5"
                  stroke="#404446"
                  strokeWidth="0.5"
                />
                <path
                  d="M10.0003 11.3337C10.7367 11.3337 11.3337 10.7367 11.3337 10.0003C11.3337 9.26395 10.7367 8.66699 10.0003 8.66699C9.26395 8.66699 8.66699 9.26395 8.66699 10.0003C8.66699 10.7367 9.26395 11.3337 10.0003 11.3337Z"
                  stroke="#404446"
                  strokeWidth="0.8"
                />
                <path
                  d="M12.6668 14.0003C12.6668 14.737 12.6668 15.3337 10.0002 15.3337C7.3335 15.3337 7.3335 14.737 7.3335 14.0003C7.3335 13.2637 8.52683 12.667 10.0002 12.667C11.4735 12.667 12.6668 13.2637 12.6668 14.0003Z"
                  stroke="#404446"
                  strokeWidth="0.8"
                />
                <path
                  d="M18.6668 12.0003C18.6668 14.5143 18.6668 15.7717 17.8855 16.5523C17.1048 17.3337 15.8475 17.3337 13.3335 17.3337H10.6668C8.15283 17.3337 6.8955 17.3337 6.11483 16.5523C5.3335 15.7717 5.3335 14.5143 5.3335 12.0003C5.3335 9.48633 5.3335 8.22899 6.11483 7.44833C6.8955 6.66699 8.15283 6.66699 10.6668 6.66699H13.3335C15.8475 6.66699 17.1048 6.66699 17.8855 7.44833C18.1988 7.76166 18.3862 8.15099 18.4988 8.66699M16.6668 12.0003H14.0002M16.6668 10.0003H13.3335M16.6668 14.0003H14.6668"
                  stroke="#404446"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <input
              className="py-4 text-lg font-sans w-[180px] font-normal text-blue-gray-700 outline-none"
              placeholder="Enter UUID here...."
              ref={uuidRef} // Directly referencing the input field
              onChange={handleUUIDinput}
              type="number"
            />

            <div className="  text-blue-gray-500" onClick={navigateUUID}>
              <img src={snd} alt="snd img" className=" w-[30px]" />
            </div>
          </div>
          <div className="px-4 my-6">
            <button
              className=" bg-slate-50 p-3 w-full  border border-solid text-xl font-medium text-lightBlack text-center border-slate-300  rounded-lg "
              onClick={deactiveMember}
            >
              Deactivate Member
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default AdScanner;
