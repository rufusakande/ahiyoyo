const axios = require('axios');
const https = require('https');

class FeexpayClass {
  constructor() {
    this.id = process.env.FEEXPAY_SHOP;
    this.token = process.env.FEEXPAY_TOKEN;
    this.callback_url = 'https://your-callback-url.com';
    this.error_callback_url = 'https://your-callback-url.com';
    this.mode = 'LIVE';

    // ✅ Initialiser axiosInstance correctement
    this.axiosInstance = axios.create({
      baseURL: 'https://api.feexpay.me/api',
      //timeout: 10000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
  }

  async getIdAndMarchanName() {
    try {
      const response = await this.axiosInstance.get(`/shop/${this.id}/get_shop`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des infos du shop:", error.response?.data || error.message);
      throw error;
    }
  }

    async paiementLocal(amount, phoneNumber, operatorName, fullname, email, callback_info = '', description,custom_id = '', otp = '') {
    try {
      const response = await this.axiosInstance.post('/transactions/requesttopay/integration', {
        phoneNumber,
        amount,
        reseau: operatorName,
        token: this.token,
        shop: this.id,
        first_name: fullname,
        description,
        email,
        callback_info,
        reference: custom_id,
        otp
      });

      if (!response.data || !response.data.reference) {
        throw new Error("Référence de paiement non retournée par l'API.");
      }

      return response.data.reference;
    } catch (error) {
      console.error("Erreur lors de l'initialisation du paiement local:", error.response?.data || error.message);
      throw error;
    }
  }

  async paiementCard(amount, phoneNumber, typeCard, firstName, lastName, email, country, address, district, currency, callback_info = '', custom_id = '') {
    try {
      const shopInfo = await this.getIdAndMarchanName();

      const response = await this.axiosInstance.post('/transactions/card/inittransact/integration', {
        phone: phoneNumber,
        amount,
        reseau: typeCard,
        token: this.token,
        shop: this.id,
        first_name: firstName,
        last_name: lastName,
        email,
        country,
        address1: address,
        district,
        currency,
        callback_info,
        reference: custom_id,
        systemCardPay: shopInfo.systemCardPay
      });

      if (!response.data.url) {
        throw new Error("Réponse inattendue de l'API.");
      }

      return {
        url: response.data.url,
        reference: response.data.reference
      };
    } catch (error) {
      console.error("Erreur lors du paiement par carte:", error.response?.data || error.message);
      throw error;
    }
  }

  async getPaiementStatus(paiementRef) {
    try {
      const response = await this.axiosInstance.get(`/transactions/getrequesttopay/integration/${paiementRef}`);
      const statusData = response.data;

      return {
        amount: statusData.amount,
        clientNum: statusData.payer?.partyId || "Inconnu",
        status: statusData.status,
        reference: statusData.reference
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du statut de paiement:", error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = FeexpayClass;
