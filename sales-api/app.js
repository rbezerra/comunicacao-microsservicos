import express from "express";
import cors from "cors";

const app = express();
const { env } = process;
const PORT = env.PORT || 8082;

app.use(cors());

app.get("/api/status", (req, res) => {
  res.status(200).json({
    service: "sales-api",
    status: "up",
    httpStatus: 200,
  });
});

app.listen(PORT, () => {
  console.info(`Server started successfully at port ${PORT}`);
});
