const multer = require('multer');
const path = require('path');

// Configuration de multer pour l'upload
const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Dossier où les fichiers seront stockés
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Générer un nom unique pour chaque fichier
    }
});

// Filtre des types de fichiers et limite de taille
const fileFilter = (req, file, cb) => {
    const fileTypes = /pdf|docx|doc|png|jpeg|jpg/;  // Autoriser PDF, DOCX, DOC, PNG, JPEG, JPG
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);  // Accepter le fichier
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Format de fichier non autorisé.'));
    }
};

// Configuration Multer avec limites de taille (5MB max)
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});

// Middleware de gestion des erreurs Multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        let errorMessage = "Erreur de téléchargement du fichier.";
        if (err.code === "LIMIT_FILE_SIZE") {
            errorMessage = "Le fichier dépasse la taille maximale de 5MB.";
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            errorMessage = "Seuls les fichiers PDF, DOCX, DOC, PNG, JPEG, JPG sont autorisés.";
        }
        return res.status(400).json({ message: errorMessage });
    }
    next(err);
};

module.exports = { upload, handleMulterError };
