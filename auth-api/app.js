import express from "express";
import cors from "cors";
const app = express();
const { env } = process;
const PORT = env.PORT || 8080;

app.use(cors());

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
