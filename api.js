import express from "express";
const app = express();

// endpoint to serve the task text
app.get("/screen", (req, res) => {
  res.send("Take your 2pm meds 💊");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ API running on port " + PORT);
});
