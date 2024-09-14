const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const utility = require("./app/utils/utility");
const db = require("./app/models");
const logger = require("morgan");
const uploadRoutes = require("./app/routes/uploadRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startTime = Date.now();

app.use(logger("common"));

db.sequelize
  .sync()
  .then(() => {
    const endTime = Date.now(); // End the timer
    const connectionTime = endTime - startTime; // Time in milliseconds
    const seconds = (connectionTime / 1000).toFixed(2); // Convert to seconds
    const minutes = (connectionTime / 60000).toFixed(2); // Convert to minutes

    console.log(
      `Database connection established. Time taken: ${connectionTime} ms (${seconds} seconds or ${minutes} minutes)`
    );
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  });
app.get("/", (req, res) => {
  return utility.sendSuccessResponse(res, "Perfect Server is Online Now.");
});

app.use("/api/v1", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
