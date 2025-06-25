const express = require("express");
const bodyParser = require("body-parser");
const PayAlipay = require("../models/PayAlipay"); // Modèle de transaction
const sequelize = require("../models/db"); // Connexion Sequelize
require("dotenv").config();

const app = express();

// Middleware pour parser le JSON
app.use(bodyParser.json());

const webhookFeexpay = async (req, res) => {
    try {


        const token = req.headers.authorization?.split(' ')[1];

        if (token !== process.env.FEEXPAY_KEY_WEBHOOK) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { reference, amount, status, callback_info } = req.body;

        console.log("🔔 Webhook reçu de FeexPay !");
        console.log("📌 ID de transaction FeexPay:", reference);
        console.log("💰 Montant:", amount);
        console.log("📜 Statut:", status);
        console.log("📦 Callback Info:", callback_info);

        // Vérifier si `callback_info` contient un paymentId
        const callbackData = JSON.parse(callback_info);
        if (!callbackData.paymentId) {
            console.warn("⚠️ Aucun paymentId trouvé dans callback_info !");
            return res.status(400).json({ error: "paymentId manquant" });
        }

        const paymentId = callbackData.paymentId;

        // Rechercher le paiement en base de données
       //const payment = await PayAlipay.findByPk(paymentId);
        const payment = await PayAlipay.findOne({ where: { id: paymentId} });
        

        if (!payment) {
            console.warn(`🚨 Transaction introuvable pour l'ID: ${paymentId}`);
            return res.status(404).json({ error: "Transaction non trouvée" });
        }

        // Mettre à jour le statut du paiement
        let newStatus = "pending";
        if (status === "SUCCESSFUL") {
            newStatus = "completed";
        } else if (status === "FAILED") {
            newStatus = "failed";
        }

        await payment.update({ statusPayement: newStatus });

        console.log(`✅ Statut de la transaction ${paymentId} mis à jour: ${newStatus}`);

        // Répondre à FeexPay
        return res.status(200).json({ message: "Webhook traité avec succès" });

    } catch (error) {
        console.error("❌ Erreur lors du traitement du webhook:", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
};

module.exports = { webhookFeexpay };


