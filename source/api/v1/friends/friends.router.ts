import { Router } from 'express';


import authJwt from '../../../middleware/authJwt';

import { addFriend, removeFriend, acceptFriend } from './friends.controller';

const friend = Router();

friend.post('/add-friend', authJwt.verifyToken, addFriend);

friend.delete('/remove-friend', authJwt.verifyToken, removeFriend);

friend.post('/accept-friend', authJwt.verifyToken, acceptFriend);

export default friend;
