import { Router } from 'express';

import wrap from '@src/api/async-wrapper';

import ctrl from './auth.controller';

const auth = Router();

auth.post('/signup', wrap(ctrl.signup));
auth.post('/login', wrap(ctrl.login));
auth.post('/token', wrap(ctrl.token));
auth.post('/logout', wrap(ctrl.logout));
auth.get('/protected', wrap(ctrl.protectedUser));

export default auth;
