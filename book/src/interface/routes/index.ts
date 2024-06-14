import { Router } from "express";
import bookRouter from "./bookRoutes";
import memberRoutes from "./memberRoutes";


const router = Router()


router.use("/books", bookRouter)
router.use("/member", memberRoutes)


export default router