# Imagen base

FROM node:22-slim

# Carpeta de trabajo

WORKDIR /usr/src/app

# Copiamos los manifiestos para cachear dependencias

COPY package*.json ./

# Instalamos dependencias

RUN npm ci --omit=dev

# Copiamos el resto del codigo (incluye /model)

COPY . .

# El servicio escucha en 3002.

EXPOSE 3002

# Comando de arranque

CMD ["node", "server.js"]
