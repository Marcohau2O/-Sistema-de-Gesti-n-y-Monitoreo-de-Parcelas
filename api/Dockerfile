# api/Dockerfile
FROM node:18

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar todas las dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto de la API
EXPOSE 4000

# Comando por defecto para levantar la API
CMD ["npm", "run", "dev"]
