const cors = require("cors");
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const websiteRoutes = require("./routes/websiteRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const visitorRoutes = require("./routes/visitorRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/websites", websiteRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/", (req, res) => {
  res.send("ASBS Backend running successfully!");
});

const PORT = 6543;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
