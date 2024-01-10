"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const package_json_1 = require("../../package.json");
const logger_1 = __importDefault(require("./logger"));
const logger = logger_1.default.instance;
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version: package_json_1.version,
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                UserRegistration: {
                    type: "object",
                    properties: {
                        firstName: {
                            type: "string",
                        },
                        lastName: {
                            type: "string",
                        },
                        email: {
                            type: "string",
                            format: "email",
                        },
                        password: {
                            type: "string",
                            format: "password",
                        },
                    },
                    required: ["firstName", "lastName", "email", "password"],
                },
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                        },
                        username: {
                            type: "string",
                        },
                        firstName: {
                            type: "string",
                        },
                        lastName: {
                            type: "string",
                        },
                        email: {
                            type: "string",
                        },
                        friends: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "string",
                                    },
                                    fromId: {
                                        type: "string",
                                    },
                                    toId: {
                                        type: "string",
                                    },
                                    status: {
                                        type: "string",
                                    },
                                    createdAt: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                        friended: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "string",
                                    },
                                    fromId: {
                                        type: "string",
                                    },
                                    toId: {
                                        type: "string",
                                    },
                                    status: {
                                        type: "string",
                                    },
                                    createdAt: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                        required: ["id", "firstName", "lastName", "email", "friends", "friended"],
                    },
                },
                Friend: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                        },
                        fromId: {
                            type: "string",
                        },
                        toId: {
                            type: "string",
                        },
                        status: {
                            type: "string",
                        },
                        createdAt: {
                            type: "string",
                        },
                    },
                    required: ["id", "fromId", "toId", "status", "createdAt"],
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./source/api/**/*.router.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, host, port) {
    // Swagger page
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    //Docs in JSON format
    app.get("docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    logger.info(`Docs available at http://${host}:${port}/docs`);
}
exports.default = swaggerDocs;
