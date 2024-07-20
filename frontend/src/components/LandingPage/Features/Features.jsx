import FeatureImg from "../../../images/screens.webp";
import WorkoutSvg from "../../../images/Workout.svg";
import MembershipSvg from "../../../images/Membership.svg";
import qrAttendanceSvg from "../../../images/QrAttendance.svg";
const Features = () => {
  return (
    <div className=" md:flex w-screen bg-[rgb(249,232,232)] relative  mt-[5rem] overflow-hidden">
      <div className="img py-10 md:flex">
        <img
          src={FeatureImg}
          alt="Screen"
          className=" scale-150 object-contain"
        />
      </div>

      <div className="feature pt-10  min-w-[50vw] md:flex flex-col  place-content-center">
        <h2 className="text-center text-5xl md:text-6xl font-bold mb-5 text-gray-600">
          Key Features
        </h2>
        <div className="text-center mb-10">
          <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
          <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
          <span className="inline-block w-40 h-1 rounded-full bg-indigo-500"></span>
          <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
          <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
        </div>
        <div className="details py-10 flex flex-col gap-10">
          <div className="workoutContainer flex px-5 gap-5">
            <div className="svg min-w-14  place-self-center">
              <img src={WorkoutSvg} alt="workout" />
            </div>
            <div className="text flex flex-col  text-start gap-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Workout Plans
              </h2>
              <p>
                Customizable workout plans for users, including exercises, sets,
                reps, and durations.
              </p>
            </div>
          </div>
          <div className="membershipContainer flex px-5 gap-5">
            <div className="svg min-w-14  place-self-center">
              <img src={MembershipSvg} alt="membership" />
            </div>
            <div className="text flex flex-col  text-start gap-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Membership Management
              </h2>
              <p>
                Simple tracking of active and paused memberships with paid and
                unpaid status.
              </p>
            </div>
          </div>
          <div className="QrAttendanceContainer flex px-5 gap-5">
            <div className="svg min-w-14  place-self-center">
              <img src={qrAttendanceSvg} alt="qr attendance" />
            </div>
            <div className="text flex flex-col  text-start gap-3">
              <h2 className="text-lg font-semibold text-gray-700">
                QR Attendance
              </h2>
              <p>
                Seamlessly track attendance of cheq In and cheq Out with QR
                code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
