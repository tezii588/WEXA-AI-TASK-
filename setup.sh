#!/bin/bash
echo "Setting up StockFlow MVP..."

# Backend setup
cd backend
npm init -y
npm install express cors bcryptjs jsonwebtoken @prisma/client dotenv
npm install -D prisma nodemon
npx prisma init --datasource-provider sqlite

cd ../frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes 2>/dev/null || true

echo "Done!"
