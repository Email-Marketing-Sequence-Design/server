import { Router } from "express";
import { scheduleSequence } from "../controllers/sequence.controllers.js";


const router = Router()

router.post('/schedule-sequence', scheduleSequence);

export default router;