import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API документация',
      version: '0.0.1',
      description: 'Sakura API',
    },
  },
  apis: ['./source/api/v1/**/*.swagger.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;