import express from "express"
import dotenv from "dotenv"
import db from "./src/infrastructure/database/prismaClient"
import router from "./src/interface/routes"
import cors from "cors"
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swaggerOption';

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(router)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(PORT, async () => {
    await db.$connect()
    console.log(`Server Running on PORT ${PORT}`);

})