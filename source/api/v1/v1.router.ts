import { Router } from "express";
import auth from "./auth/auth.router";
import friends from "./friends/friends.router";
import users from "./users/users.router";
import firendRequests from "./friendRequests/friendRequests.router";

const v1 = Router();

v1.use("/auth", auth);
v1.use("/users", users);
v1.use("/friends", friends);
v1.use("/friend-requests", firendRequests);

export default v1;
