const express = require('express');
const Country = require('../models/Country');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

// ✅ Récupérer la liste des pays
router.get('/', async (req, res) => {
    try {
        const countries = await Country.findAll();
        res.json(countries);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ✅ Ajouter un nouveau pays
router.post('/add', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, countryCode, phoneCode, nationality } = req.body;
        if (!name || !countryCode || !phoneCode ) {
            return res.status(400).json({ message: "Tous les champs (nom, code pays, indicatif) sont requis." });
        }

        const existingCountry = await Country.findOne({ where: { name } });
        if (existingCountry) return res.status(400).json({ message: "Ce pays existe déjà." });

        const country = await Country.create({ name, countryCode, phoneCode });
        res.json({ message: "Pays ajouté avec succès.", country });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ✅ Supprimer un pays
router.delete('/delete/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const country = await Country.findByPk(id);

        if (!country) return res.status(404).json({ message: "Pays non trouvé." });

        await country.destroy();
        res.json({ message: "Pays supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
