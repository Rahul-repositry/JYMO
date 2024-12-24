import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase.js";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignupUserContext } from "../../context/context.jsx";
import axios from "axios";
import { setObjectInLocalStorage } from "../../utils/helperFunc.js";

export default function Gauth({ setUpdateData, confirmChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [signupData, updateSignupData] = useSignupUserContext();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Check the page and update accordingly
      if (location.pathname === "/login") {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/api/auth/google`,
          {
            idToken,
            name: result.user.displayName,
            email: result.user.email,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const { data } = response;

        if (data.success === false) {
          toast.error(`${data.message}`);
          return;
        }
        toast.success("Welcome To Jymo");
        setObjectInLocalStorage("user", response.data.user);
        navigate("/home");
        return;
      } else if (location.pathname === "/signup") {
        updateSignupData({
          username: result.user.displayName,
          email: result.user.email,
          firebaseEmailIdToken: idToken,
          img: result.user.photoURL,
        });
        return;
      } else if (location.pathname.includes("profile")) {
        if (setUpdateData) {
          // Instead of directly setting the updateData, prompt the user
          confirmChange(); // Trigger the confirmation modal
          setUpdateData({
            email: result.user.email,
            firebaseEmailIdToken: idToken,
          });
        }
        return;
      }
      toast.error("Page not found");
    } catch (error) {
      console.log("Could not log in with Google", error);
      if (error?.response?.data?.message === "Signup first to get registered") {
        navigate("/signup");
        return toast.error(`${error.response.data.message}`);
      }
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-5">
      <button
        onClick={handleGoogleClick}
        className="flex place-content-center py-3 text-md font-medium text-customButton border border-customButton rounded-lg w-full"
        style={{ border: "1px solid #FF8A62" }}
      >
        <svg
          className="h-6 w-6 mr-2"
          width="800px"
          height="800px"
          viewBox="-0.5 0 48 48"
          version="1.1"
        >
          <g
            id="Icons"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g id="Color-" transform="translate(-401.000000, -860.000000)">
              <g id="Google" transform="translate(401.000000, 860.000000)">
                <path
                  d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                  id="Fill-1"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                  id="Fill-2"
                  fill="#EB4335"
                ></path>
                <path
                  d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.381,47.4666667 34.3521591,45.5514667 38.52075,42.0656 L31.0359091,36.4266667 C28.7831818,37.8549333 26.3261591,38.7333333 23.7136364,38.7333333"
                  id="Fill-3"
                  fill="#34A853"
                ></path>
                <path
                  d="M46.1454545,24 C46.1454545,22.7365333 46,21.4912 45.7363636,20.2933333 L23.7136364,20.2933333 L23.7136364,28.1866667 L36.4856818,28.1866667 C35.855,31.2469333 34.2020455,33.7482667 31.6613636,35.4208 L38.52075,42.0656 C42.8369545,38.0229333 46.1454545,31.9466667 46.1454545,24"
                  id="Fill-4"
                  fill="#4285F4"
                ></path>
              </g>
            </g>
          </g>
        </svg>
        Continue with Google
      </button>
    </div>
  );
}
