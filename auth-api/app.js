import express from "express";
import cors from "cors";
import * as db from "./src/config/db/initialData.js";
import userRoutes from "./src/modules/user/routes/UserRoutes.js";
import checkToken from "./src/config/auth/checkToken.js";

const app = express();
const { env } = process;
const PORT = env.PORT || 8080;

app.use(cors());

db.createInitialData();

app.use(express.json());

app.use(userRoutes);

app.get("/api/status", (req, res) => {
  return res.status(200).json({
    service: "AUTH",
    status: "up",
    httpStatus: 200,
  });
});



app.listen(PORT, () => {
  console.info(`Server started successfully at port ${PORT}`);
});
