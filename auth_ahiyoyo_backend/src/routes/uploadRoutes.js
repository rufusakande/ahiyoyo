const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const fs = require('fs').promises;

const router = express.Router();

// Création des dossiers nécessaires s'ils n'existent pas
const createRequiredDirectories = async () => {
    const directories = ['uploads', 'uploads/temp'];
    for (const dir of directories) {
        try {
            await fs.access(dir);
        } catch {
            await fs.mkdir(dir, { recursive: true });
        }
    }
};

// Configuration de multer pour stocker les fichiers temporairement
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await createRequiredDirectories();
        cb(null, 'uploads/temp');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        // On utilise un timestamp temporaire, le fichier sera renommé après
        cb(null, `temp_${timestamp}${ext}`);
    }
});

// Filtrage des fichiers autorisés
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.doc', '.docx', '.pdf', '.png', '.jpeg', '.jpg'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new multer.MulterError('INVALID_FILE_TYPE', 'Format de fichier non autorisé !'));
    }
};

// Initialisation de multer
const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite à 5MB
    }
}).single('document');

// Middleware de gestion des erreurs multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: true,
                message: "Le fichier est trop volumineux. Taille maximum : 5MB"
            });
        }
        if (error.code === 'INVALID_FILE_TYPE') {
            return res.status(400).json({
                error: true,
                message: error.message || "Format de fichier non autorisé"
            });
        }
        return res.status(400).json({
            error: true,
            message: "Erreur lors du téléchargement du fichier"
        });
    }
    next(error);
};

router.post('/identity', (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }

        let tempFilePath = null;
        
        try {
            const { email, firstName, lastName } = req.body;

            // Vérification des champs requis
            if (!email || !firstName || !lastName) {
                return res.status(400).json({ 
                    error: true,
                    message: "Tous les champs (prénom, nom, email) sont requis." 
                });
            }

            // Vérification du fichier
            if (!req.file) {
                return res.status(400).json({ 
                    error: true,
                    message: "Aucun fichier envoyé." 
                });
            }

            tempFilePath = req.file.path;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                // Suppression du fichier temporaire
                await fs.unlink(tempFilePath);
                return res.status(404).json({ 
                    error: true,
                    message: "Utilisateur non trouvé." 
                });
            }

            // Vérification si le document est déjà soumis
            if (user.isDocumentSubmitted) {
                // Suppression du fichier temporaire
                await fs.unlink(tempFilePath);
                return res.status(400).json({ 
                    error: true,
                    message: "Document déjà soumis." 
                });
            }

            // Vérification si l'identité est déjà vérifiée
            if (user.isIdentityVerified) {
                // Suppression du fichier temporaire
                await fs.unlink(tempFilePath);
                return res.status(400).json({ 
                    error: true,
                    message: "Identité déjà vérifiée." 
                });
            }

            // Création du nom de fichier final avec l'identifiant de l'utilisateur
            const ext = path.extname(req.file.originalname);
            const date = new Date().toISOString().split('T')[0];
            const finalFileName = `${user.userIdentifier}_identity_${date}${ext}`;
            const finalPath = path.join('uploads', finalFileName);

            // S'assurer que le dossier uploads existe
            await createRequiredDirectories();

            // Déplacer et renommer le fichier
            await fs.rename(tempFilePath, finalPath);

            // Mise à jour de l'utilisateur avec le chemin du fichier
            user.isDocumentSubmitted = true;
            user.identityDocument = finalPath;
            user.firstName = firstName;
            user.lastName = lastName;
            await user.save();

            res.json({ 
                error: false,
                message: "Document soumis avec succès !",
                filePath: finalPath 
            });

        } catch (error) {
            // En cas d'erreur, supprimer le fichier temporaire s'il existe
            if (tempFilePath) {
                try {
                    await fs.unlink(tempFilePath);
                } catch (unlinkError) {
                    console.error('Erreur lors de la suppression du fichier temporaire:', unlinkError);
                }
            }
            
            return res.status(500).json({
                error: true,
                message: "Une erreur est survenue lors du traitement de votre demande."
            });
        }
    });
});

// Route pour servir les fichiers uploadés
router.get('/uploads/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../../uploads', filename);
        
        // Vérifier si le fichier existe
        await fs.access(filePath);
        
        // Définir le type de contenu selon l'extension
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'application/octet-stream';
        
        switch (ext) {
            case '.pdf':
                contentType = 'application/pdf';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.doc':
                contentType = 'application/msword';
                break;
            case '.docx':
                contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
        }
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'inline'); // Pour prévisualisation
        console.log(filePath)
        // Envoyer le fichier
        res.sendFile(filePath);
        
    } catch (error) {
        console.error('Erreur lors de la récupération du fichier:', error);
        res.status(404).json({
            error: true,
            message: 'Fichier non trouvé'
        });
    }
});

module.exports = router;