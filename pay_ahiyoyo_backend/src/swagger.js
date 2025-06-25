const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ahiyoyo Pay API',
      version: '1.0.0',
      description: 'Documentation API pour Ahiyoyo Pay - Système de recharge Alipay',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        WordPressToken: {
          type: 'apiKey',
          in: 'header',
          name: 'wordpressToken',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
        WordPressToken: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

module.exports = swaggerJsdoc(options);