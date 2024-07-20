import { useState } from "react";
import PropTypes from "prop-types";

const Accordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative z-20 overflow-hidden bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-10 ">
            <div className="text-start  md:text-center max-w-xl mx-auto">
              <h1 className="text-6xl md:text-7xl font-bold mb-5 text-gray-600">
                What people <br />
                are asking?
              </h1>
              <h3 className="text-xl mb-5 font-light">
                Questions that are generally asked by the owners & members of
                the jyms.
              </h3>
              <div className="text-center mb-10">
                <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
                <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
                <span className="inline-block w-40 h-1 rounded-full bg-indigo-500"></span>
                <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
                <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              index={0}
              activeIndex={activeIndex}
              handleToggle={handleToggle}
              header="Jymo kya hai?"
              text="Jymo💪 ek gym management app hai jo gym owners ko unke gym operations simplify karne mein madad karta hai💪. Yeh app attendance track karna, membership manage karna aur workout plans banane jaise features provide karta hai.👍"
            />
            {/* Add more AccordionItems as needed */}
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              index={1}
              activeIndex={activeIndex}
              handleToggle={handleToggle}
              header="Jymo kaise kaam karta hai?"
              text="Aapko bas Jymo app download karna hai, apna gym profile set up karna hai, aur members ko jymo app pr signup karwana hai. Phir aap easily attendance track kar sakte hain ✅ aur memberships manage kar sakte hain. 👍"
            />
            {/* Add more AccordionItems as needed */}
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              index={2}
              activeIndex={activeIndex}
              handleToggle={handleToggle}
              header="Kya Jymo ka use karna mushkil hai?"
              text="Bilkul nahi! Jymo ka user interface kaafi simple aur user-friendly hai. 😌 Aap bina kisi technical knowledge ke easily use kar sakte hain.😌"
            />
            {/* Add more AccordionItems as needed */}
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              index={3}
              activeIndex={activeIndex}
              handleToggle={handleToggle}
              header="Jymo ka subscription fee kya hai?"
              text="Jymo abhi 👶 beta version mai hai 👶 so abhi ye Free of charges hai. isliye tum chahe jitne marzi members add kr skte ho."
            />
            {/* Add more AccordionItems as needed */}
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              index={4}
              activeIndex={activeIndex}
              handleToggle={handleToggle}
              header="Jymo App mai jymo diet kya hai ?"
              text="Yeh jymo members k liye ek initiative hai jo ki unko apni diet maintain krne mai help krta hai  aur essential nutrients provide krta hai for their effective muscle growth . 🤤 Sath hi mai yeh kafi Tasty 🤤 bhi hai!!"
            />
            {/* Add more AccordionItems as needed */}
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              index={5}
              activeIndex={activeIndex}
              handleToggle={handleToggle}
              header=" Kya isme fingerprint add kr skte hai?"
              text="🫡 Currently jymo mai fingerprint attendance funconality nahi hai but jaldi se jaldi we will add it .🫡"
            />
            {/* Add more AccordionItems as needed */}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 z-[-1]">
        <svg
          width="1440"
          height="886"
          viewBox="0 0 1440 886"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.5"
            d="M193.307 -273.321L1480.87 1014.24L1121.85 1373.26C1121.85 1373.26 731.745 983.231 478.513 729.927C225.976 477.317 -165.714 85.6993 -165.714 85.6993L193.307 -273.321Z"
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="1308.65"
              y1="1142.58"
              x2="602.827"
              y2="-418.681"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3056D3" stopOpacity="0.36" />
              <stop offset="1" stopColor="#F5F2FD" stopOpacity="0" />
              <stop offset="1" stopColor="#F5F2FD" stopOpacity="0.096144" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

const AccordionItem = ({ index, activeIndex, handleToggle, header, text }) => {
  const isActive = activeIndex === index;

  return (
    <div
      className={`mb-8 mx-3 border border-gray-200  rounded-lg bg-white px-2 py-3 shadow-[0px_20px_95px_0px_rgba(201,203,204,0.30)] sm:p-8 lg:px-6 xl:px-8`}
    >
      <button
        className={`faq-btn flex w-full text-left`}
        onClick={() => handleToggle(index)}
      >
        <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-primary/5 text-primary ">
          <svg
            className={`fill-primary stroke-primary duration-200 ease-in-out ${
              isActive ? "rotate-180" : ""
            }`}
            width="17"
            height="10"
            viewBox="0 0 17 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
              fill=""
              stroke=""
            />
          </svg>
        </div>

        <div className="w-full">
          <h4 className="mt-1 text-lg font-semibold text-dark  text-gray-600">
            {header}
          </h4>
        </div>
      </button>

      <div
        className={`pl-[62px] transition-[max-height] duration-500 ease-in-out overflow-hidden ${
          isActive ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <p className="py-3 text-base text-start leading-relaxed text-gray-500 ">
          {text}
        </p>
      </div>
    </div>
  );
};

AccordionItem.propTypes = {
  index: PropTypes.number.isRequired,
  activeIndex: PropTypes.number,
  handleToggle: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Accordion;
