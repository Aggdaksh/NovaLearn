import express from "express"
import dotenv from "dotenv"
import connectDb from "./configs/db.js"
import authRouter from "./routes/authRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/userRoute.js"
import courseRouter from "./routes/courseRoute.js"
import paymentRouter from "./routes/paymentRoute.js"
import aiRouter from "./routes/aiRoute.js"
import reviewRouter from "./routes/reviewRoute.js"
dotenv.config()

let port = process.env.PORT || 8000
let app = express()
app.use(express.json())
app.use(cookieParser())

const configuredOrigins = [
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
]
    .flatMap((value) => (value ? value.split(",") : []))
    .map((value) => value.trim())
    .filter(Boolean)

const allowedOrigins = Array.from(
    new Set([
        ...configuredOrigins,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ])
)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error("Not allowed by CORS"))
    },
    credentials: true
}))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ai", aiRouter)
app.use("/api/review", reviewRouter)


app.get("/", (req, res) => {
    res.send("Hello From Server")
})

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

const startServer = async () => {
    try {
        await connectDb()
        app.listen(port , ()=>{
            console.log(`Server Started on port ${port}`)
        })
    } catch (error) {
        console.error("Server startup aborted because MongoDB connection failed.")
        process.exit(1)
    }
}

startServer()


