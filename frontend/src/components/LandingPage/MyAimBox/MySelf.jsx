import Logo from "../../../images/Logo.svg";
import Noise from "../../../images/Noise.webp";
import NoiseSvg from "../../../images/Noise.svg";
import Rahul from "../../../images/Rahul.webp";

import "./MySelf.css";
import { Link } from "react-router-dom";
const MySelf = () => {
  return (
    <div className="myselfContainer mt-16 relative w-screen relative overflow-x-clip">
      <div className="myAimContainer relative overflow-hidden    custom-md800:hidden md:grid-cols-3 w-screen  pb-[200px] ">
        <img
          src={Rahul}
          alt="Rahul"
          className="absolute  z-10 bottom-0 w-[300px] bottom-[-30px] right-[-50px]"
        />
        <div className="logoContainer  flex justify-center border md:col-span-1  border-white mx-8 py-5 rounded-[40px] my-9 ">
          <div
            style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
            className=" logoBox  relative z-10 inline-block p-12 md:p-4 rounded-full "
          >
            <img
              src={Logo}
              alt="My Aim Logo"
              className=" w-32 z-10"
              style={{ boxShadow: "0px 0px 0px 50px gr" }}
            />
          </div>
        </div>
        {/* <div className="logobigscreen relative w-[30vw] flex">
        div.back
        <img src={Logo} alt="Jymo" />
      </div> */}
        <div className="details col-span-2 px-9 relative z-10 italic flex flex-col text-start px-5  gap-8">
          <h2 className="text-orange-500 text-2xl  font-bold  py-4">
            FOUNDER OF JYMO
          </h2>
          <p className="  text-bl text-lg text-gray-700">
            Hello!! I am Rahul as a fitness enthusiast and tech lover, I created
            Jymo to simplify gym management. From QR code attendance to
            membership handling, Jymo makes running your gym easy and efficient.
          </p>
          <p className="button">
            <Link to="/home">Try It Now</Link>
          </p>
          <p className="button">
            <a href="mailto:jyymmoo@gmail.com">Let&apos;s Connect</a>
          </p>
        </div>
        <img
          src={Noise}
          alt="Noise"
          className=" absolute   bg-repeat w-full h-full opacity-[9%] object-cover top-0 left-0"
        />
        <img
          src={NoiseSvg}
          alt="Noise"
          className=" absolute bg-repeat w-full h-full opacity-[15%] object-cover top-0 left-00"
        />
      </div>
      <div className="myAimContainer mdSize relative   hidden custom-md800:flex  gap-[20px] custom-lg1100: pr-[17rem] place-items-center w-screen  pl-5  md:justify-around ">
        <div className="logoContainer  md:col-span-1 ">
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5) ",
              boxShadow: "0 0 30px 0 rgba(0, 0, 255, 0.2) ",
            }}
            className=" logoBox  relative z-10 inline-block p-12 md:p-4 rounded-full "
          >
            <img
              src={Logo}
              alt="My Aim Logo"
              className=" w-28 z-10"
              style={{ boxShadow: "0px 0px 0px 50px gr" }}
            />
          </div>
        </div>

        <div className="details py-10 gap-5 place-self-start col-span-3 relative z-10 italic  flex  md:max-w-[430px] custom-md800::max-w-[500px] custom-md900:max-w-[560px]  lg:max-w-[620px] md:flex-col custom-lg1100:max-w-[700px]  text-start  ">
          <h2 className="text-orange-500 text-2xl  font-bold  ">
            FOUNDER OF JYMO
          </h2>
          <p className="  text-bl text-lg text-gray-700">
            Hello!! I am Rahul as a fitness enthusiast and tech lover, I created
            Jymo to simplify gym management. From QR code attendance to
            membership handling, Jymo makes running your gym easy and efficient.
          </p>
          <div className="buttonContainer flex gap-8">
            <p className="button ">
              <Link href="/home">Try It Now</Link>
            </p>
            <p className="button">
              <a href="mailto:jyymmoo@gmail.com">Let&apos;s Connect</a>
            </p>
          </div>
        </div>
        <img
          src={Rahul}
          alt="Rahul"
          className="absolute  hidden md:flex z-10 bottom-0 w-[300px] bottom-[-10px] right-[-10px] "
        />
        <img
          src={Noise}
          alt="Noise"
          className=" absolute   bg-repeat w-full h-full opacity-[9%] top-0 left-0"
        />
        <img
          src={NoiseSvg}
          alt="Noise"
          className=" absolute bg-repeat w-full h-full opacity-[15%] object-cover top-0 left-00"
        />
      </div>
    </div>
  );
};

export default MySelf;
