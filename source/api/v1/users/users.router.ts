import { Router } from 'express';

import {getAllUsersController} from './users.controller';

const users = Router();

users.get('/getAllUsers', getAllUsersController)

export default users;
