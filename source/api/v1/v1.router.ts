import { Router } from "express";
import auth from "./auth/auth.router";
import friends from "./friends/friends.router";
import users from "./users/users.router";
import firendRequests from "./friendRequests/friendRequests.router";

const v1 = Router();

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               msg: Неверно заполнена форма регистрации
 *       '409':
 *         description: Conflict
 *         content:
 *           application/json:
 *             example:
 *               msg: Этот email уже зарегистрирован
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate a user and generate access and refresh tokens
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User login data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 userWithoutPassword:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                 required:
 *                   - accessToken
 *                   - refreshToken
 *                   - userWithoutPassword
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Неверный email или пароль
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

/**
 * @openapi
 * /api/v1/auth/token:
 *   post:
 *     summary: Generate a new access token using a valid refresh token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: Refresh token data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 required:
 *                   - accessToken
 *                   - refreshToken
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Refresh token не предоставлен
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               msg: Неверный refresh token
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out the user by invalidating the refresh token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: Refresh token data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               msg: Вы успешно вышли из своего аккаунта
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Refresh token не предоставлен
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               msg: Неверный refresh token
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

/**
 * @openapi
 * /api/v1/auth/userInfo:
 *   get:
 *     summary: Get user details for the authenticated user
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                   required:
 *                     - id
 *                     - email
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token не предоставлен
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token устарел
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               msg: Пользователь не найден
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

v1.use("/auth", auth);

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Get a list of all users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token не предоставлен
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token устарел
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               msg: Пользователь не найден
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

/**
 * @openapi
 * /api/v1/users/{friendId}:
 *   post:
 *     summary: Send a friend request to another user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         description: The ID of the user to send a friend request to.
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               msg: Вы отправили заявку в друзья {friend.firstName} {friend.lastName}
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               msg: Неверный формат friend ID, Вы не можете отправить заявку в друзья самому себе, Вы уже друзья с этим пользователем, Вы уже отправили заявку в друзья этому пользователю
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token не предоставлен
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token устарел
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               msg: Пользователь не найден
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

v1.use("/users", users);

/**
 * @openapi
 * /api/v1/friends:
 *   get:
 *     summary: Get a list of friends for the authenticated user
 *     tags:
 *       - Friends
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Friend'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token не предоставлен
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token устарел
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               msg: Пользователь не найден
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

/**
 * @openapi
 * /api/v1/friends/{friendId}:
 *   delete:
 *     summary: Delete a friend by ID
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: path
 *         name: friendId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the friend to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               msg: Вы удалили {user.firstName} {user.lastName} из друзей
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               msg: Неверный формат friend ID, Вы не можете удалить себя из друзей
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token не предоставлен
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token устарел, Вы не являетесь друзьями с этим пользователем
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               msg: Пользователь не найден
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

v1.use("/friends", friends);

/**
 * @openapi
 * /api/v1/friend-requests/received:
 *   get:
 *     summary: Get a list of received friend requests
 *     tags:
 *       - Friend Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fromId:
 *                     type: integer
 *                   toId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token не предоставлен
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token устарел
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               msg: Пользователь не найден
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

/**
 * @openapi
 * /api/v1/friend-requests/sent:
 *   get:
 *     summary: Get a list of sent friend requests
 *     tags:
 *       - Friend Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fromId:
 *                     type: integer
 *                   toId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token не предоставлен
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token устарел
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               msg: Пользователь не найден
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

/**
 * @openapi
 * /api/v1/friend-requests/{requestId}/accept:
 *   post:
 *     summary: Accept a friend request
 *     tags:
 *       - Friend Requests
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the friend request to accept
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               msg: Вы приняли заявку в друзья от {user.firstName} {user.lastName}
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               msg: Неверный формат request ID, Вы уже приняли эту заявку, Вы не можете принять свою заявку
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token не предоставлен
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token устарел
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               msg: Пользователь не найден, Заявка в друзья не найдена
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

/**
 * @openapi
 * /api/v1/friend-requests/{requestId}/reject:
 *   delete:
 *     summary: Reject a friend request
 *     tags:
 *       - Friend Requests
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the friend request to reject
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               msg: Вы отклонили заявку в друзья от {user.firstName} {user.lastName}
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               msg: Неверный формат request ID
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token не предоставлен
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token устарел, Вы можете отклонить только входящие вам заявки
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               msg: Пользователь не найден, Заявка в друзья не найдена
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

/**
 * @openapi
 * /api/v1/friend-requests/{requestId}/cancel:
 *   delete:
 *     summary: Cancel a friend request
 *     tags:
 *       - Friend Requests
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the friend request to cancel
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               msg: Вы отменили заявку в друзья от {user.firstName} {user.lastName}
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               msg: Неверный формат request ID
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token не предоставлен
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               msg: Access token устарел, Вы можете отменить только исходящие от вас заявки
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               msg: Пользователь не найден, Заявка в друзья не найдена
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: Внутренняя ошибка сервера
 */

v1.use("/friend-requests", firendRequests);

export default v1;
