<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Teslo 
1. Clonar repo

2. Instalar dependencias
```sh
yarn install
```

3. Clonar el archivo `.env.example` y renombrarlo a `.env` establecer variable de entrono 

4. Levantar DB
```sh
docker-compose up -d
```

5. Ejecutar aplicacion
```sh
yarn start:dev
```

6. Ejecucion seeds
```sh
curl --location --request POST 'localhost:3000/api/v1/seed'
```