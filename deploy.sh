#!/bin/bash

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Construir la aplicación
echo "Construyendo la aplicación..."
npm run build


# Copiar archivos de configuración
echo "Copiando archivos de configuración..."
cp .env dist/

# Iniciar la aplicación con PM2
echo "Iniciando la aplicación con PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "Instalando PM2..."
    npm install -g pm2
fi

# Detener la aplicación si ya está corriendo
pm2 stop inventory-frontend || true
pm2 delete inventory-frontend || true

# Iniciar la aplicación
cd dist
pm2 serve . 5173 --name "inventory-frontend" --spa

echo "¡Despliegue completado!"
echo "La aplicación está corriendo en http://localhost:5173" 