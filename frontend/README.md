# NextH - Tableau de bord bien-être

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)](https://docker.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com)

Application moderne de suivi santé et bien-être avec interface immersive en dark mode.

## 🚀 Démarrage rapide avec Docker

### Prérequis

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Configuration

1. **Clonez le repository** :
   ```bash
   git clone <votre-repo>
   cd NextH-project
   ```

2. **Configurez les variables d'environnement** :
   ```bash
   cp docker.env.example .env
   ```

   Éditez le fichier `.env` avec vos vraies valeurs :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-ici
   DATABASE_URL=postgresql://username:password@hostname:5432/database_name
   JWT_SECRET=votre-cle-secrete-jwt-super-longue-et-complexe-ici
   ```

### Lancement en production

```bash
# Construction et lancement des conteneurs
npm run prod

# Ou directement avec docker-compose
docker-compose up -d
```

L'application sera accessible sur :
- **Frontend** : http://localhost:3003
- **Backend API** : http://localhost:3002

### Développement

Pour le développement avec rechargement à chaud :

```bash
# Lancement en mode développement
npm run dev

# Ou directement avec docker-compose
docker-compose -f docker-compose.dev.yml up
```

## 🛠️ Scripts disponibles

```bash
# Production
npm run docker:build    # Construire les images
npm run docker:up       # Lancer les conteneurs
npm run docker:down     # Arrêter les conteneurs
npm run docker:logs     # Voir les logs
npm run docker:restart  # Redémarrer les services
npm run docker:clean    # Nettoyer tout (conteneurs, volumes, images)

# Développement
npm run dev            # Mode développement avec hot-reload
npm run prod           # Mode production
```

## 📁 Structure du projet

```
NextH-project/
├── frontend/              # Application Next.js
│   ├── app/              # Pages Next.js 13+ (App Router)
│   ├── components/       # Composants React
│   ├── lib/              # Utilitaires et API
│   ├── Dockerfile        # Image production
│   ├── Dockerfile.dev    # Image développement
│   └── .dockerignore
├── backend/              # API Express.js
│   ├── src/              # Code source
│   ├── prisma/           # Schéma base de données
│   ├── Dockerfile        # Image production
│   ├── Dockerfile.dev    # Image développement
│   └── .dockerignore
├── supabase/             # Schéma SQL Supabase
├── docker-compose.yml    # Configuration production
├── docker-compose.dev.yml # Configuration développement
├── docker.env.example    # Variables d'environnement
└── package.json          # Scripts Docker
```

## 🗄️ Base de données

L'application utilise **Supabase** comme base de données principale :

1. Créez un projet sur [Supabase](https://supabase.com)
2. Exécutez le script SQL `supabase/schema.sql` dans l'éditeur SQL de Supabase
3. Copiez l'URL et la clé API dans votre fichier `.env`

## 🔧 Développement sans Docker

Si vous préférez développer sans Docker :

### Frontend
```bash
cd frontend
cp env.example .env.local  # Configurez vos variables
npm install
npm run dev
```

### Backend
```bash
cd backend
cp .env.example .env      # Configurez vos variables
npm install
npx prisma generate
npm run dev
```

## 🚢 Déploiement

### Sur un serveur avec Docker

```bash
# Sur votre serveur
git clone <votre-repo>
cd NextH-project
cp docker.env.example .env
# Éditez .env avec vos vraies valeurs

# Lancement
docker-compose up -d
```

### Avec Vercel (Frontend uniquement)

Le frontend peut être déployé sur Vercel :
```bash
cd frontend
vercel --prod
```

## 📊 Fonctionnalités

- ✅ **Tableau de bord santé** avec métriques en temps réel
- ✅ **Suivi d'activités** et gestion des challenges
- ✅ **Profils utilisateurs** avec données biométriques
- ✅ **Journal quotidien** des habitudes
- ✅ **Graphiques interactifs** avec Recharts
- ✅ **Interface dark mode** moderne
- ✅ **Responsive design** pour mobile et desktop

## 🛡️ Sécurité

- Variables d'environnement pour les clés sensibles
- Authentification JWT côté backend
- Validation des données avec Zod
- Headers de sécurité CORS configurés

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajout de nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

MIT - Voir le fichier LICENSE pour plus de détails.