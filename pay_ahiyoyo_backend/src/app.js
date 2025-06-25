const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const authRoutes = require('./routes/authRoutes');
const payAlipayRoute = require('./routes/payAlipayRoute');
const profileRoutes = require('./routes/profilRoutes');
const webhookFeexpay = require('./routes/webhookFeexpayRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pay-alipay', payAlipayRoute);
app.use('/api/profile', profileRoutes);
app.use('/api/webhook-pay/feexpay', webhookFeexpay);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

module.exports = app;