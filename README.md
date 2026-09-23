# ChatSocket

Chat temps reel avec Socket.IO, modules ES, Prisma et persistance des messages.

## Developpement local

```powershell
Copy-Item .env.example .env
npm install
npm run prisma:sqlite:generate
npm run prisma:sqlite:migrate -- --name init
npm start
```

La base SQLite est creee dans `prisma/dev.db`. Les 100 derniers messages sont
envoyes a chaque nouvelle connexion.

## Render / PostgreSQL

Definir `DATABASE_URL` avec l'URL PostgreSQL fournie par Render ou AlwaysData,
puis utiliser ces commandes dans le build/deploiement :

```bash
npm install
npm run prisma:postgres:generate
npm run prisma:postgres:push
```

La commande de demarrage est `npm start`. Render fournit automatiquement la
variable `PORT`; le serveur utilise `3005` uniquement en local.