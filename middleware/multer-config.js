const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    "image/bmp": "bmp",
    "image/tiff": "tif",
    "image/tif": "tif",
    "image/webp": "webp",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");

        // Recuperer l'extension du file du MIME type
        const extension = MIME_TYPES[file.mimetype];

        if (!extension) {
            // Le  MIME type file n'est pas reconnu 
            const error = new Error('Invalid file type');

            // callback arrive dans le controlleur
            callback(error);

        }

        //Le  MIME type file est correct 
        else {
            const filename = name + Date.now() + "." + extension;
            callback(null, filename);
        }

    },
});

module.exports = multer({ storage: storage }).single("image");