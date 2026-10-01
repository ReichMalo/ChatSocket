# ChatSocket

Chat temps reel avec Socket.IO, modules ES, Prisma et persistance des messages.

## Developpement local avec PostgreSQL

```powershell
Copy-Item .env.example .env
npm install
npx prisma db push
npx prisma generate
npm start
```

Remplacez les valeurs d'exemple de `DATABASE_URL` par l'URL complete fournie
par Alwaysdata. Le fichier `.env` est ignore par Git car il contient le mot de
passe de la base de donnees. Les 100 derniers messages sont envoyes a chaque
nouvelle connexion.

## Render / PostgreSQL

Definir `DATABASE_URL` avec l'URL PostgreSQL fournie par Render ou AlwaysData,
puis utiliser ces commandes dans le build/deploiement :

```bash
npm install && npx prisma generate
npx prisma db push
```

La commande de demarrage est `npm start`. Render fournit automatiquement la
variable `PORT`; le serveur utilise `3005` uniquement en local.