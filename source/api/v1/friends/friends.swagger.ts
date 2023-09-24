/**
 * @swagger
 * /api/v1/friends/add-friend:
 *   post:
 *     summary: Добавление друга
 *     description: Добавление друга в список друзей.
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: body
 *         name: friendData
 *         description: Данные друга для добавления.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *             friendId:
 *               type: string
 *     responses:
 *       200:
 *         description: Друг успешно добавлен
 *       500:
 *         description: Ошибка сервера
 * /api/v1/friends/remove-friend:
 *   post:
 *     summary: Удаление друга
 *     description: Удаление друга из списка друзей.
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: body
 *         name: friendData
 *         description: Данные друга для удаления.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *             friendId:
 *               type: string
 *     responses:
 *       200:
 *         description: Друг успешно удален
 *       500:
 *         description: Ошибка сервера
 */
