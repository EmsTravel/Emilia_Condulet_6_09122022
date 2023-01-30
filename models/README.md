Architecture des répertoires

Créez un dossier vide.

Dans ce dossier, clonez le repo Back_P6_OCR, et renommez-le "back" :

git clone git@github.com:https://github.com/EmsTravel/Emilia_Condulet_6_09122022.git

Toujours dans le même dossier, clonez le repo suivant :

git clone git@github.com:https://github.com/EmsTravel/Emilia_Condulet_6_09122022.git

Dans le dossier back, installez les dépendances :

npm install

Dans le dossier front

npm run start




Base de données
L'API est conçu pour fonctionner avec MongoDB Atlas et nécessite un cluster. L'identifiant, le mot de passe, le nom de la base de données et celui du cluster sont nécessaire pour la création du fichier .env et initialiser les variables d'environnement.




Démarrer le serveur back
Pour démarrer le serveur back sans intention de modifier les fichiers :

node server

Pour démarrer le serveur dans l'intention de modifier les fichiers et permettre au serveur de se relancer automatiquement :

nodemon server

Le port de communication est 3000.




Démarrer le serveur front
Pour démarrer le serveur front :

npm run start

Le port de communication est 4200.




Problème de ports connu
Si l'un ou l'autre des serveurs n'utilise pas les ports prévus, veuillez redémarrer l'ordinateur.




Accès à l'application
Dans le navigateur, veuillez atteindre l'adresse suivante :

localhost:4200




Exigences de sécurité
Utilisation de dépendances pour la sécurité (OWASP)

bcrypt
dotenv
jsonwebtoken
mongoose-unique-validator
Helmet
express-rate-limiter

Utilisation de regex pour vérification des champs email Utilisation de conditions pour éviter des injections et l'envoi de formulaire vide



Contenu du fichier .env
TOKEN = token pour l'utilisation de jsonwebtoken






