FROM node:20-alpine

WORKDIR /app

# Copiar dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production
RUN npm install -g @nestjs/cli

# Generar cliente de Prisma
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]
