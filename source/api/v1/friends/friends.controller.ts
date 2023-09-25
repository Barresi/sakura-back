import { Response } from 'express';

import { RequestWithUserId } from '@src/api/async-wrapper';
import Database from '@src/clients/database';
import Friends from '@src/data/friends';

const db = Database.instance;



export async function addFriend(req: RequestWithUserId, res: Response): Promise<Response> {
  const userId: number = req.userId!;
  const { friendId } = req.body;

  try {
    const friendUser = await db.user.findUnique({ where: { id: friendId } });

    if (!friendUser) {
      return res.status(400).json({ error: 'Пользователь с friendId не найден' });
    }

    if (userId === friendId) {
      return res.status(400).json({ error: 'Невозможно добавить самого себя в качестве друга' });
    }

    if (await Friends.friendRequestAlreadyExists(userId, friendId)) {
      return res.status(400).json({ error: 'Запрос в друзья уже существует' });
    }

    // Создаем запись в исходящих запросах (outgoingRequests) и уведомление в поле friendOf
    await Friends.createOutgoingRequest(userId, friendId);

    return res.json({ message: 'Запрос на добавление в друзья успешно отправлен' });
  } catch (error) {
    console.error('Ошибка при добавлении друга:', error);
    return res.status(500).json({ error: 'Ошибка при добавлении друга' });
  }
}
// Принятие запроса в друзья
export async function removeFriend(req: RequestWithUserId, res: Response): Promise<void> {
  const { userId, friendId } = req.body;
  try {
    await Friends.acceptFriend(userId, friendId);
    res.json({ message: 'Запрос на добавление в друзья успешно принят' });
  } catch (error) {
    console.error('Ошибка при принятии запроса в друзья:', error);
    res.status(500).json({ error: 'Ошибка при принятии запроса в друзья' });
  }
}

// Удаление друга
export async function acceptFriend(req: RequestWithUserId, res: Response): Promise<void> {
  const { userId, friendId } = req.body;
  try {
    await Friends.removeFriend(userId, friendId);
    res.json({ status: true });
  } catch (error) {
    console.error('Ошибка при удалении друга:', error);
    res.status(500).json({ error: 'Ошибка при удалении друга' });
  }
}
