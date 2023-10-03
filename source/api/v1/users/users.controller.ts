import { Response } from 'express';

import { RequestWithUserId } from "@src/api/async-wrapper";
import Users from '@src/data/user';

export async function getAllUsersController(req: RequestWithUserId, res: Response): Promise<void> {
  try {
    const users = await Users.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Failed to fetch all users' });
  }
}
