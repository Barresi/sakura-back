"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const zod_1 = require("zod");
function signup(req, res) {
    // https://stackoverflow.com/questions/2370015/regular-expression-for-password-validation
    const passwordRegex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
    const schema = zod_1.z.object({
        username: zod_1.z.string().optional(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email().trim(),
        password: zod_1.z.string().regex(passwordRegex).trim(),
    });
    try {
        return schema.parse(req.body);
    }
    catch (error) {
        res.status(400).json({ msg: "Неверно заполнена форма регистрации" });
    }
}
exports.signup = signup;
