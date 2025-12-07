import compression from "compression";
import cors from "cors";
import express from "express";
import { PostRouter } from "./modules/post/post.router";
import { UserRouter } from "./modules/user/user.route";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(compression());
app.use(express.json());

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/post", PostRouter);

app.get("/", (_req, res) => res.send("API running"));

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

export default app;
