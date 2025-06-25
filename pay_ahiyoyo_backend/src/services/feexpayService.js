const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

class FeexPayService {
  constructor() {
    this.API_URL = "https://api.feexpay.me/api/transactions/requesttopay/integration";
    this.TOKEN = process.env.FEEXPAY_TOKEN;
    this.SHOP = process.env.FEEXPAY_SHOP;
  }

  generateReference() {
    return crypto.randomBytes(8).toString('hex').slice(0, 15);
  }

  async requestPayment({
    phoneNumber,
    phoneNumberRight,
    amount,
    reseau,
    firstName,
    email,
    otp,
    callbackInfo,
    description
  }) {
    try {
      const paymentData = {
        phoneNumber,
        phoneNumberRight,
        amount,
        reseau,
        token: this.TOKEN,
        shop: this.SHOP,
        first_name: firstName,
        email,
        reference: this.generateReference(),
        otp,
        callback_info: callbackInfo,
        description
      };

      const response = await axios.post(this.API_URL, paymentData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la requête de paiement:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = FeexPayService;