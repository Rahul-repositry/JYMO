// import React from "react";
import Grid from "../../../images/gridPattern.webp";

import textLogo from "../../../images/textLogo.webp";
import Ravi from "../../../images/RaviSharma.webp";
import Karan from "../../../images/KaranSingh.webp";
import Ankit from "../../../images/AnkitVerma.webp";
import Sunita from "../../../images/sunita.webp";
import "./HeroSection.css"; // Import the CSS file
import Navbar from "../../websiteNavbar/navbar";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className=" animated-grid-container ">
      <Navbar />
      <div
        style={{ backgroundImage: `url(${Grid})` }}
        alt="Grid Pattern"
        className="grid-pattern -z-10 opacity-50"
      ></div>
      <div className="Hero flex mx-auto flex-col text-start p-6 bg-transparent gap-6 sm:gap-10 pt-[5vh] custom-md400:pt-[15vh] max-w-[800px] sm:place-items-center sm:text-center lg:gap-8 lg:pt-[10vh] relative z-10">
        <div className="img w-24">
          <img src={textLogo} alt="Jymo" loading="lazy" />
        </div>
        <div className="title text-4xl font-bold leading-[1.2] sm:text-6xl  sm:py-3 lg:text-7xl">
          Revolutionizing Jym <br /> Management
        </div>
        <div className="breif max-w-[400px]">
          <p className=" text-gray-500 text-xl">
            Streamline your gym operations, manage members effortlessly, and
            boost engagement with our all-in-one gym management app.
          </p>
        </div>
        <div className="button text-xl font-bold text-white text-bor tracking-wide">
          <p className="">
            <Link to="/home">Get Started Free</Link>
          </p>
        </div>
        <div className="groupicons sm:pt-10 lg:pt-0 relative ">
          <div className=" groupImage flex -space-x-2 overflow-hiddeni ">
            <img
              className="inline-block h-10 w-10 object-cover rounded-full ring-2 ring-white"
              src={Ravi}
              alt=""
            />
            <img
              className="inline-block h-10 w-10 object-cover rounded-full ring-2 ring-white"
              src={Karan}
              alt="Akhilesh"
              loading="lazy"
            />
            <img
              className="inline-block object-cover h-10 w-10 rounded-full ring-2 ring-white"
              src={Sunita}
              alt="Suresh"
              loading="lazy"
            />
            <img
              className="inline-block relative object-cover lastImg h-10 w-10 rounded-full ring-2 ring-white"
              src={Ankit}
              alt="Sagar"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
