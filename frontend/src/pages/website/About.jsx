import Navbar from "../../components/websiteNavbar/navbar";
import Footer from "../../components/LandingPage/Footer/Footer";
import "../Css/About.css";
const About = () => {
  return (
    <>
      <Navbar />
      <div className="about">
        <div className="PrivacyPolicy flex flex-col  px-12 pb-10">
          <div className="policyContainer">
            <div className="title text-start my-5 text-4xl font-bold leading-[1.2] sm:text-6xl  sm:py-3 lg:text-7xl">
              About Us
            </div>
          </div>
          <br />
          <br />
          <h2 className="h2Style">Welcome to Jymo!</h2>
          <br />
          <p className="paraStyle pb-5">
            At Jymo, we are passionate about revolutionizing the fitness
            industry through innovative technology. Our mission is to empower
            gym owners and members with a seamless and efficient platform that
            simplifies gym management and enhances the overall experience.
          </p>
          <div className="content ">
            <h2 className="h2Style">Our Story</h2>
            <br />
            <p className="paraStyle">
              Jymo was founded by a team of fitness enthusiasts and technology
              experts who recognized the challenges faced by gym owners in
              managing their operations. We wanted to create a solution that
              would streamline these processes, making it easier for gym owners
              to focus on what they do best—helping people achieve their fitness
              goals. With this vision in mind, Jymo was born.
            </p>
            <br />
            <br />
            <h2 className="h2Style">Our Vision</h2>
            <br />
            <p className="paraStyle">
              Our vision is to transform the way gyms operate by providing an
              all-in-one management solution that is intuitive, reliable, and
              user-friendly. We believe that technology can play a pivotal role
              in enhancing the efficiency and effectiveness of gym management,
              ultimately contributing to the success of fitness businesses.
            </p>
            <br />
            <br />
            <h2 className="h2Style">Our Commitment</h2>
            <br />
            <p className="paraStyle">
              We are committed to providing exceptional customer service and
              continuous improvements to our app. Your feedback is invaluable to
              us, and we strive to incorporate your suggestions to make Jymo
              even better. Our goal is to ensure that Jymo remains a trusted
              partner in your fitness journey.
            </p>
            <br />
            <br />
            <h2 className="text-xl text-start text-gray-700  font-semibold">
              Thank you for choosing Jymo. We look forward You to be a part of
              jymo .
            </h2>
            <br />
            <h2 className="text-xl text-start text-gray-700  font-semibold">
              Warm regards,
            </h2>
            <br />
            <h2 className="text-xl text-start text-gray-700  font-semibold">
              The Jymo Team{" "}
            </h2>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;
