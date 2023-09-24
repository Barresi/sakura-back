import { Request, Response } from 'express';

import Friends from '@src/data/friends';

// Добавление друга
export const addFriend = async (req: Request, res: Response) => {
  const { userId, friendId } = req.body;
  try {
    await Friends.createFriend(userId, friendId);
    res.json({ message: 'Пользователь успешно добавлен в друзья' });
  } catch (error) {
    console.error('Ошибка при добавлении друга:', error);
    res.status(500).json({ error: 'Ошибка при добавлении друга' });
  }
};

// Удаление друга
export const removeFriend = async (req: Request, res: Response) => {
  const { userId, friendId } = req.body;
  try {
    await Friends.removeFriend(userId, friendId);
    res.json({ message: 'Пользователь успешно удален из друзей' });
  } catch (error) {
    console.error('Ошибка при удалении друга:', error);
    res.status(500).json({ error: 'Ошибка при удалении друга' });
  }
};
