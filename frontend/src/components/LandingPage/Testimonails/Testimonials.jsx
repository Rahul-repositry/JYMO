import PropTypes from "prop-types";
// import "https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css";

import Karan from "../../../images/KaranSingh.webp";
import Tushar from "../../../images/TusharMehra.webp";
import Ankit from "../../../images/AnkitVerma.webp";
import Priya from "../../../images/PriyaMehto.webp";
import Sunita from "../../../images/sunita.webp";
import Ravi from "../../../images/RaviSharma.webp";

const Testimonials = () => {
  return (
    <div className=" w-screen bg-gray-50 flex items-center justify-center py-5">
      <div className="w-full bg-white border-t border-b border-gray-200 px-5 py-16 md:py-24 text-gray-800">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-start md:text-center max-w-xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold mb-5 text-gray-600">
              What people <br />
              are saying.
            </h1>
            <h3 className="text-xl mb-5 font-light">
              Some reviews that are showing how jymo is benefiting their jym
              member & Owners.
            </h3>
            <div className="text-center mb-10">
              <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
              <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
              <span className="inline-block w-40 h-1 rounded-full bg-indigo-500"></span>
              <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
              <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
            </div>
          </div>
          <div className="-mx-3 flex flex-wrap items-start max-w-[100vw] ">
            <Testimonial
              imgSrc={Ravi}
              name="Ravi Sharma"
              text="Jymo ne humare gym operations ko badal kar rakh diya hai. Attendance track karna aur handle karna itna easy kabhi nahi tha!"
            />
            <Testimonial
              imgSrc={Priya}
              name="Priya Mehto"
              text="Mujhe Jymo ka workout plan feature bahut pasand aaya. Mere goals ke hisaab se exercises plan karna ab asaan ho gaya hai."
            />
            <Testimonial
              imgSrc={Ankit}
              name="Ankit Verma"
              text="Jymo ke saath, members ko manage karna aur unke progress ko track karna kaafi simple ho gaya hai. Yeh app truly amazing hai!"
            />
            <Testimonial
              imgSrc={Tushar}
              name="Tushar Mehra"
              text="Nice work rahul bhai , isme chat funconality aur payment facility hoti toh aur bhi accha hota "
            />
            <Testimonial
              imgSrc={Sunita}
              name="Sunita Rao"
              text="Pause membership feature ki wajah se mera poora mahina barbaad hone se reh gaya .Nice work"
            />
            <Testimonial
              imgSrc={Karan}
              name="Karan Singh"
              text="QR code se attendance mark karna itna convenient hai. Jymo ne mere gym experience ko next level pe le jaa diya hai."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonial = ({ imgSrc, name, text }) => (
  <div className="px-3 md:w-1/3">
    <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-5 text-gray-800 font-light mb-6">
      <div className="w-full flex mb-4 items-center">
        <div className="overflow-hidden relative rounded-full w-14 h-14  border-2 border-gray-400">
          <img
            src={imgSrc}
            alt={name}
            className=" absolute w-full h-full object-cover "
          />
        </div>
        <div className="flex-grow pl-3">
          <h6 className="font-bold text-sm  uppercase text-gray-600">{name}</h6>
        </div>
      </div>
      <div className="w-full">
        <p className="text-sm leading-tight text-start">
          <span className="text-lg  leading-none italic font-bold text-gray-400 mr-1">
            &quot;
          </span>
          {text}
          <span className="text-lg  leading-none italic font-bold text-gray-400 ml-1">
            &quot;
          </span>
        </p>
      </div>
    </div>
  </div>
);

Testimonial.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Testimonials;
