const winston = require("winston");
const path = require("path");
const DailyRotateFile = require("winston-daily-rotate-file");

// 📌 Définition des niveaux de logs
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// 📌 Définition des couleurs pour chaque niveau
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue"
};

winston.addColors(colors);

// 📌 Format des logs
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

// 📌 Définition des transports (AVEC LA CORRECTION)
const transports = [];

// 📌 Logs de rotation journalière
transports.push(new DailyRotateFile({
    filename: path.join(__dirname, "../../logs/%DATE%-combined.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d" // Conserve les logs des 30 derniers jours
}));

// 📌 Enregistrement des erreurs dans un fichier dédié
transports.push(new winston.transports.File({
    filename: path.join(__dirname, "../../logs/error.log"),
    level: "error",
    format: logFormat
}));

// 📌 En développement, afficher les logs en console
if (process.env.NODE_ENV !== "production") {
    transports.push(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            logFormat
        )
    }));
}

// 📌 Création du logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    levels,
    transports
});

module.exports = logger;
