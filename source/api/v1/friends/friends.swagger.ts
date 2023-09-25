/**
 * @swagger
 *
 * /api/v1/friends/add-friend:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Добавление друга
 *     description: Отправка заявки на добавление друга.
 *     tags:
 *       - Friends
 *     requestBody:
 *         required: true
 *         description: Данные пользователей для отправки запроса в друзья.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friendId:
 *                   type: integer
 *                   default: 2
 *     responses:
 *       200:
 *         description: успешно добавлен
 *
 * /api/v1/friends/accept-friend:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Принятие запроса в друзья
 *     description: Принятие запроса в друзья отправленного другим пользователем.
 *     tags:
 *       - Friends
 *     requestBody:
 *         required: true
 *         description: Данные пользователей для принятия запроса в друзья.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friendId:
 *                   type: integer
 *                   default: 1
 *     responses:
 *       200:
 *         description: Запрос в друзья успешно принят
 *       400:
 *         description: Некорректный запрос. Убедитесь, что данные пользователей указаны правильно.
 *       500:
 *         description: Ошибка сервера
 *


 * /api/v1/friends/remove-friend:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Удаление друга
 *     description: Удаление друга из списка друзей.
 *     tags:
 *       - Friends
 *     requestBody:
 *         required: true
 *         description: Данные друга для удаления.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friendId:
 *                   type: integer
 *                   default: 2
 *     responses:
 *       200:
 *         description: Друг успешно удалён
 *       400:
 *         description: Некорректный запрос. Убедитесь, что данные друга указаны правильно.
 *       500:
 *         description: Ошибка сервера
 */
