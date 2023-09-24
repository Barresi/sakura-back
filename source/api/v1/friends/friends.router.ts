import { Router } from 'express';


import wrap from '@src/api/async-wrapper';

import {addFriend, removeFriend} from './friends.controller';

const friend = Router();




friend.post('/add-friend', wrap(addFriend));
friend.post('/remove-friend', wrap(removeFriend));

export default friend;

