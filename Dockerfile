# Usamos una imagen oficial de Node.js ligera
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto de la aplicación
COPY . .

# Exponemos el puerto de Vite
EXPOSE 3000

# Ejecutamos el servidor de desarrollo exponiéndolo a la red docker
CMD ["npm", "run", "dev", "--", "--host"]
