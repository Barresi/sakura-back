# ㊙️ Социальная сеть "Sakura"

_Backend часть Open Source проекта "Sakura"_

---

[![preview](https://i.ibb.co/NFcD2dk/image.png)]()

---

**Sakura** предлагает разнообразный функционал для удобства пользователей:

- **Чаты:** Возможность общаться с другими пользователями через личные и групповые чаты.

- **Добавление в друзья:** Функция позволяет пользователям добавлять друг друга в список друзей для более легкого взаимодействия и доступа к профилям.

- **Система уведомлений:** Уведомления о новых сообщениях, друзьях, активности в группах и других событиях, чтобы пользователи всегда оставались в курсе происходящего.

- **Настройка аккаунта:** Возможность изменять настройки профиля, конфиденциальности и другие параметры для персонализации пользовательского опыта.

- **Редактирование профиля:** Возможность пользователей изменять информацию в своем профиле, включая фотографии, описание и личные данные.

- **Просмотр новостей:** Доступ к новостной ленте, где пользователи могут узнавать актуальную информацию о событиях, обновлениях и интересных материалах от сообщества.

- **Смена темы приложения:** Опция выбора темы оформления для приложения, чтобы пользователи могли настроить внешний вид интерфейса в соответствии со своими предпочтениями и комфортом для глаз.

Этот функционал обеспечивает удобство взаимодействия и позволяет пользователям наслаждаться полным и разнообразным опытом использования социальной сети **Sakura**.

---

Авторизация написана посредством **JWT + Refresh token**. Это предоставляет возможность пользователям единожды авторизоваться с помощью логин + пароль, а дальше система сама будет авторизовывать пользователя через **access** и **refresh** токены.

При регистрации, данные пользователя (имя, фамилия, эл. почта, пароль) валидируются и заносятся в **основную базу данных (PostgreSQL)**. Также происходит проверка на уникальность электронной почты и хэширование пароля для дополнительной защиты данных пользователя.

При авторизации **refresh токен** храниться в **Redis** в связке с id пользователя. **Access токен** обновляется посредством дополнительного эндпоинта для перевыпуска токенов, где также происходит их верификация.

Взаимодействие с сервером происходит посредством:

- **REST API** - регистрация, авторизация, взаимодействие с друзьями, получение информации о пользователе, некоторый функционал мессенджера и т.д.
- **WebSocket** - функционал получения всех типов уведомлений, чаты с другими пользователями.

---

**Фронтенд:**

<img src="https://img.shields.io/badge/React-494a52?style=for-the-badge&logo=react&logoColor=white"/> <img src="https://img.shields.io/badge/Redux Toolkit-494a52?style=for-the-badge&logo=redux&logoColor=white"/> <img src="https://img.shields.io/badge/TypeScript-494a52?style=for-the-badge&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/Shadcn UI-494a52?style=for-the-badge&logo=shadcnui&logoColor=white"/> <img src="https://img.shields.io/badge/Tailwind-494a52?style=for-the-badge&logo=tailwindcss&logoColor=white"/> <img src="https://img.shields.io/badge/ESLint-494a52?style=for-the-badge&logo=eslint&logoColor=white"/> <img src="https://img.shields.io/badge/Prettier-494a52?style=for-the-badge&logo=prettier&logoColor=white"/> <img src="https://img.shields.io/badge/Vite-494a52?style=for-the-badge&logo=vite&logoColor=white"/> <img src="https://img.shields.io/badge/Socket.io-494a52?style=for-the-badge&logo=socketdotio&logoColor=white"/>

**Бэкенд:**

<img src="https://img.shields.io/badge/Express-494a52?style=for-the-badge&logo=Express&logoColor=white"/> <img src="https://img.shields.io/badge/TypeScript-494a52?style=for-the-badge&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/PostgreSQL-494a52?style=for-the-badge&logo=PostgreSQL&logoColor=white"/> <img src="https://img.shields.io/badge/Prisma-494a52?style=for-the-badge&logo=Prisma&logoColor=white"/> <img src="https://img.shields.io/badge/Redis-494a52?style=for-the-badge&logo=Redis&logoColor=white"/> <img src="https://img.shields.io/badge/Zod-494a52?style=for-the-badge&logo=Zod&logoColor=white"/> <img src="https://img.shields.io/badge/Docker-494a52?style=for-the-badge&logo=Docker&logoColor=white"/> <img src="https://img.shields.io/badge/Pino-494a52?style=for-the-badge&logo=Pino&logoColor=white"/> <img src="https://img.shields.io/badge/Prettier-494a52?style=for-the-badge&logo=prettier&logoColor=white"/> <img src="https://img.shields.io/badge/husky-494a52?style=for-the-badge&logo=husky&logoColor=white"/> <img src="https://img.shields.io/badge/Swagger-494a52?style=for-the-badge&logo=Swagger&logoColor=white"/> <img src="https://img.shields.io/badge/Socket.io-494a52?style=for-the-badge&logo=socketdotio&logoColor=white"/>

---

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><img src="./src//shared/assets/sakura-team/Alexey.jpg" width="100%" /><br/><a href="https://t.me/Alex130395"><sub><b>Алексей Кузнецов</b></sub></a><br/><sub>Project Manager</sub> <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td align="center" valign="top" width="14.28%"><img src="./src//shared/assets/sakura-team/Denis.jpg" width="100%" /><br /><a href="https://t.me/VPDenis"><sub><b>Денис Дюжиков</b></sub></a><br/><sub>Founder, Frontend dev</sub> <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td align="center" valign="top" width="14.28%"><img src="./src//shared/assets/sakura-team/Denis2.jfif" width="100%" /><br /><a href="https://t.me/Dunissimmo"><sub><b>Денис Москвин</b></sub></a><br/><sub>Frontend dev</sub> <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td align="center" valign="top" width="14.28%"><img src="./src//shared/assets/sakura-team/Aigul.jpg" width="100%" /><br /><a href="https://t.me/aigul_tok"><sub><b>Айгуль Токтасынова</b></sub></a><br/><sub>Backend dev</sub> <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td align="center" valign="top" width="14.28%"><img src="./src//shared/assets/sakura-team/Kate.jpg" width="100%" /><br /><a href="https://t.me/Assokka"><sub><b>Екатерина Фёдорова</b></sub></a><br/><sub>DevOps</sub> <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td align="center" valign="top" width="14.28%"><img src="./src//shared/assets/sakura-team/Boris.jfif" width="100%" /><br /><a href="https://t.me/Overkast"><sub><b>Борис Маслов</b></sub></a><br/><sub>UX/UI-designer</sub> <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td align="center" valign="top" width="14.28%"><img src="./src//shared/assets/sakura-team/Maria.jfif" width="100%" /><br /><a href="https://t.me/Maria_Kalinichenko"><sub><b>Мария Калиниченко</b></sub></a><br/><sub>QA-engineer</sub> <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
    </tr>
  </tbody>
</table>
