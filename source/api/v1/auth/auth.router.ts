import { Router } from 'express';

import wrap from '@src/api/async-wrapper';

import authJwt from '../../../middleware/authJwt';

import ctrl from './auth.controller';

const auth = Router();

auth.post('/signup', wrap(ctrl.signup));
auth.post('/login', wrap(ctrl.login));
auth.post('/token', wrap(ctrl.token));
auth.post('/logout', wrap(ctrl.logout));
auth.get('/protected', [authJwt.verifyToken], wrap(ctrl.protectedUser));

export default auth;
