import { Router } from 'express';

import v1 from './v1/v1.router';

const api = Router();

api.use('/v1', v1);

export default api;
