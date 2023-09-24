import { Router } from 'express';

import wrap from '@src/api/async-wrapper';

import ctrl from './auth.controller';
import valid from './auth.validation';

const auth = Router();

auth.post('/signup', valid.signup, wrap(ctrl.signup));
auth.post('/login', wrap(ctrl.login));
auth.post('/token', wrap(ctrl.token));
auth.delete('/logout', wrap(ctrl.logout));
auth.get('/protected', wrap(ctrl.protectedUser));

export default auth;
