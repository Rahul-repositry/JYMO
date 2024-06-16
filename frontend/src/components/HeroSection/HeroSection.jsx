// import React from "react";
import Grid from "../../images/gridPattern.webp";
import Logo from "../../images/Logo.webp";
import textLogo from "../../images/textLogo.webp";

import "./HeroSection.css"; // Import the CSS file

const HeroSection = () => {
  return (
    <div className=" animated-grid-container  ">
      <div className="navbar flex justify-between items-center bg-white px-8 py-3 border-b-2 border-gray-200 ">
        <div className="logo p-0 cursor-pointer">
          <img src={Logo} alt="Jymo" className="w-16" />
        </div>
        <div className="button sm:text-xl tracking-wide flex place-items-center">
          <div className="links hidden lg:flex gap-4 px-4 text-gray-400">
            <a href="">Privacy Policy</a>
            <a href="">Terms & Conditions</a>
          </div>
          <p className="">
            <a href="#">Try Now Free</a>
          </p>
        </div>
        <div className="links hidden"></div>
      </div>
      <div
        style={{ backgroundImage: `url(${Grid})` }}
        alt="Grid Pattern"
        className="grid-pattern -z-10 opacity-50"
      ></div>
      <div className="Hero flex mx-auto flex-col text-start p-6 bg-transparent gap-6 sm:gap-10 pt-[15vh] max-w-[750px] sm:place-items-center sm:text-center lg:gap-8 lg:pt-[10vh]">
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
            <a href="#">Get Started Free</a>
          </p>
        </div>
        <div className="groupicons sm:pt-10 lg:pt-0">
          <div className=" groupImage flex -space-x-2 overflow-hiddeni ">
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Akhilesh"
              loading="lazy"
            />
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
              alt="Suresh"
              loading="lazy"
            />
            <img
              className="inline-block relative lastImg h-10 w-10 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
