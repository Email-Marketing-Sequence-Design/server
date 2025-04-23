import {Router} from 'express'
import authRoutes from "./auth.route.js";
import sequenceRoutes from './sequence.route.js'

const routes = Router();

routes.use("/auth", authRoutes);

routes.use("/sequence", sequenceRoutes);

export default routes; 