const express = require("express");
const router = express.Router();
const { updateInactiveMemberships } = require("../controllers/membership.controller.js");

// This endpoint will be triggered by Vercel Cron
router.get("/update-memberships", async (req, res) => {
  try {
    // Check for authorization header to secure the endpoint
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    await updateInactiveMemberships();
    res.status(200).json({ success: true, message: "Memberships updated successfully" });
  } catch (error) {
    console.error("Cron job error:", error);
    res.status(500).json({ error: "Failed to update memberships" });
  }
});

module.exports = router;