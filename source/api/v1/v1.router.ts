import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import auth from './auth/auth.router';
import friends from './friends/friends.router';
import swaggerDef from './swaggerDef';

const v1 = Router();

v1.use('/auth', auth);
v1.use('/friends', friends);
v1.use('/api-docs', swaggerUi.serve);
v1.get('/api-docs', swaggerUi.setup(swaggerDef));

export default v1;
