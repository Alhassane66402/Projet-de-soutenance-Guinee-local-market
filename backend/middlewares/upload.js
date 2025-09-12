const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Crée le dossier uploads s'il n'existe pas
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, Date.now() + "_" + name + ext);
  },
});

// Filtre : uniquement images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Fichier non supporté"), false);
};

// Middleware principal
const upload = multer({ storage, fileFilter });

// Pour les utilisateurs : avatar et cover (facultatif)
const uploadUserImages = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "cover", maxCount: 1 }, // seulement pour les producteurs
]);

// Pour les produits : image principale
const uploadProductImage = upload.single("image");

module.exports = {
  upload,
  uploadUserImages,
  uploadProductImage,
};
