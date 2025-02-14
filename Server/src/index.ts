import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import notFoundMiddleware from "./middlewares/notFound";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import v1Routes from "./routes/v1";
dotenv.config();

connectDB();
const app = express();


const corsOptions = {
    origin: ["https://authentication-system-nowf.vercel.app", "http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1", v1Routes);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
