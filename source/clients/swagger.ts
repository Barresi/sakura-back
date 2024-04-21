import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import Logger from "./logger";

const logger = Logger.instance;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs",
      version,
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
            avatar: {
              type: "string",
            },
            banner: {
              type: "string",
            },
            city: {
              type: "string",
            },
            birthDate: {
              type: "string",
              format: "date",
            },
            gender: {
              type: "string",
              enum: ["male", "female"],
            },
            description: {
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
                    enum: ["PENDING", "ACCEPTED"],
                  },
                  createdAt: {
                    type: "string",
                    format: "date",
                  },
                  updatedAt: {
                    type: "string",
                    format: "date",
                  },
                  deleted: {
                    type: "string",
                    format: "date",
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
                    enum: ["PENDING", "ACCEPTED"],
                  },
                  createdAt: {
                    type: "string",
                    format: "date",
                  },
                  updatedAt: {
                    type: "string",
                    format: "date",
                  },
                  deleted: {
                    type: "string",
                    format: "date",
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
        Post: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            text: {
              type: "string",
            },
            pictures: {
              type: "array",
              items: {
                type: "string",
              },
            },
            watched: {
              type: "integer",
            },
            createdById: {
              type: "string",
            },
            createdBy: {
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
                avatar: {
                  type: "string",
                },
              },
            },
            likedBy: {
              type: "array",
              items: {
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
                  avatar: {
                    type: "string",
                  },
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            deleted: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["id", "createdById", "createdBy", "createdAt", "updatedAt"],
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

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, host: string, port: number) {
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  //Docs in JSON format
  app.get("docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Docs available at http://${host}:${port}/docs`);
}

export default swaggerDocs;
