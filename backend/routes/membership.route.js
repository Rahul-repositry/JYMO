const express = require("express");
const {
  verifyUser,
  verifyJym,
  verifyOwnership,
} = require("../utils/Middleware.utils");
const {
  membershipHandler,
  membershipPauseHandler,
  membershipResumeHandler,
  createMembership,
  markTrialAttendance,
  isMember,
  renewMembership,
  getMembership,
} = require("../controllers/membership.controller");
const router = express.Router();

/*

@ frontend : 
* person can also access createmembership from sidebar 
* after evalution from '/ismember/:id' route a user is send to frontend so with userId in route navigate to createmembership page in react  and send userId in req.body after taking it from url

There will be 2 option 

1.start a trial period  (create membership after 2 days(env variable trialDays))

2. Create Membership
  {
    on frontend page do this 

  1. take important details like amount  , months 
  2. if there is attended days after trial period get those from frontend and send it 
  2. send request to backend to create membership with details and userid in body 


  }
*/

router.post(
  "/createmembership",
  verifyUser,
  verifyJym,
  verifyOwnership,
  createMembership
);

/*

@ frontend : after evalution from '/ismember/:id' route a user is send to frontend so with userId in route navigate to createmembership page in react  and send userId in req.body after taking it from url 

there will be 2 option to choose  either they start a trial or direct create a membership so if they chooses start trial then do this 

@ backend :   {
  1. create a attendance with trial token expiry of next two days .
    a :{ 
     - for regular attendance part 
        * when person is marked for attendance again then chq if it is under expiry date then again mark the attendance with same expiry date if expiry date is over then mark day as registered and calculate it as renewmemership and adjust that registered days in membership
      }
  2. add user in jym trial user array  with data
  3. remove user from jym trial array after 90 days ( make a func on backend when owne from dashboard loads user if user trial is  greater than 90 days then remove it  ) 
  }


  # not using it now because after initiating attendance for first time  user  attendance will start automatically after scanning jymqr 

*/

// router.post(
//   "/starttrial",
//   verifyUser,
//   verifyJym,
//   verifyOwnership,
//   markTrialAttendance
// );

router.post(
  "/renewmembership",
  verifyUser,
  verifyJym,
  verifyOwnership,
  renewMembership
);

/*
@ frontend : through owner dashboard scanner user qr will be scanned and a request will be made to this below route with id  

on dashboard if new member 
 show initate user  first  



*/
router.get("/ismember/:id", verifyUser, verifyJym, verifyOwnership, isMember);

/**
  @ frontend : this route get the memberhsip bson from the db of userid & jymid  
 */
router.get("/getmembership/:jymid", verifyUser, getMembership);

module.exports = router;
