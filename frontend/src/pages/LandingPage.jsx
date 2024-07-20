import Faq from "../components/LandingPage/FAQ/Faq.jsx";
import Features from "../components/LandingPage/Features/Features.jsx";
import Footer from "../components/LandingPage/Footer/Footer.jsx";
import HeroSection from "../components/LandingPage/HeroSection/HeroSection.jsx";
import HowWorks from "../components/LandingPage/howWorks/HowWorks.jsx";
import MySelf from "../components/LandingPage/MyAimBox/MySelf.jsx";
import Testimonials from "../components/LandingPage/Testimonails/Testimonials.jsx";

const LandingPage = () => {
  return (
    <div className="max-w-[1600px] flex flex-col">
      <HeroSection />
      <div className="detail">
        <div className="details text-2xl flex flex-col text-start px-3  gap-9 py-8 mx-8 rounded-2xl  -translate-y-[15%]  custom-md400:-translate-y-[30%] sm:hidden">
          <div className="Jyms bg-white   px-6 border border-gray-400  shadow-lg rounded-2xl py-4">
            <p className="text-gray-400 ">
              <b className=" text-orange-400 text-3xl ">10+</b> Jyms
            </p>
          </div>
          <div className="locations  bg-white px-6 border border-gray-400  shadow-lg rounded-2xl py-4">
            <p className="text-gray-400 ">
              <b className=" text-orange-400 text-3xl ">5+</b> Locations
            </p>
          </div>
          <div className="activeUser  bg-white px-6 border border-gray-400  shadow-lg rounded-2xl py-4">
            <p className="text-gray-400 ">
              <b className=" text-orange-400 text-3xl ">500+</b> Active Users
            </p>
          </div>
        </div>
        <div className="details hidden bg-white shadow-lg border sm:grid sm:grid-cols-2   lg:grid-cols-3 text-2xl   px-4  py-8 mx-8 rounded-2xl  -translate-y-[15%]  ">
          <div className="activeUser  flex place-content-center px-6   pb-6 lg:py-4 col-span-3  lg:col-span-1 border-b lg:border-b-0">
            <p className="text-gray-400 ">
              <b className=" text-orange-400 text-3xl ">500+</b> Active Users
            </p>
          </div>
          <div className="locations  flex place-content-center  px-6 custom-lg1100:border-l-2  py-4">
            <p className="text-gray-400 ">
              <b className=" text-orange-400 text-3xl ">5+</b> Locations
            </p>
          </div>
          <div className="Jyms flex place-content-center   px-6 border-l-2  py-4 ">
            <p className="text-gray-400 ">
              <b className=" text-orange-400 text-3xl ">10+</b> Jyms
            </p>
          </div>
        </div>
      </div>
      <MySelf />
      <Features />
      <HowWorks />
      <Testimonials />
      <Faq />
      <Footer />
    </div>
  );
};

export default LandingPage;
