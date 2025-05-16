import express from "express";
import cors from "cors";
const app=express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth_routes.js";
import eventRouter from "./routes/event_routes.js";
import participantRouter from "./routes/participant_routes.js";
import organisateurRouter from "./routes/organisateur_routes.js"; 

dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api/events", eventRouter);
app.use("/api/auth", authRouter);
app.use("/api/participants", participantRouter);
app.use("/api/organisateurs", organisateurRouter); 

app.get("/",(req,res)=>{
  res.send("<h1>Home!</h1>");
});
mongoose.connect(process.env.URL_DB)
  .then((result)=>{
    app.listen(process.env.PORT,()=>console.log("server running"));
  }).catch((err)=>console.log(err)
);