Generador Automático de Sumarios

## Instalar y ejecutar

```bash
# Install
$ npm install

# Run
npm start
```

## Archivos de configuración iniciales
Para correr el proyecto es necesario agregar las respectivas variables de entorno.
El archivo `.env.example` se encuentran las variables necesarias.

### Crear pryecto de Google
Ingresan a https://console.developers.google.com se debe crear un proyecto y luego agregar las respectiva configuracion para
obtener las credencias que se deben agregar en las variables de entorno.
CLIENT_ID
CLIENT_SECRET
CALLBACK_URL

### Crear una instancia en MongoDB Atlas
Ingresar a https://www.mongodb.com/cloud/atlas y crear un cluster para almacenar la base de datos.
Luego agregar las credenciales a las variables de entorno.
