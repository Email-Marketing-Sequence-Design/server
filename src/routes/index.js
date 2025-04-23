import {Router} from 'express'
import sequenceRoutes from './sequence.route.js'

const routes = Router();

routes.use("/sequence", sequenceRoutes);

export default routes; 