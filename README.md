# Ubademy G2 Payments

[![codecov](https://codecov.io/gh/TP-Taller-II/TP-Taller-II-Payments/branch/master/graph/badge.svg?token=OtaojxpKyj)](https://codecov.io/gh/TP-Taller-II/TP-Taller-II-Payments)
[![Tests](https://github.com/TP-Taller-II/TP-Taller-II-Payments/actions/workflows/tests.yml/badge.svg)](https://github.com/TP-Taller-II/TP-Taller-II-Payments/actions/workflows/tests.yml)
[![Linters](https://github.com/TP-Taller-II/TP-Taller-II-Payments/actions/workflows/linters.yml/badge.svg)](https://github.com/TP-Taller-II/TP-Taller-II-Payments/actions/workflows/linters.yml)

## �C�mo correr el servicio?

Si es la primera vez o luego de haber implementado cambios:

``` bash
docker-compose build
```

> :warning: **Docker** y **Docker Compose** deben estar instalados

Para levantar el servicio:

``` bash
docker-compose up
```

y para bajar el servicio:

``` bash
docker-compose build
```

## :heavy_check_mark: �C�mo correr los tests?

Para correr los test se debe correr el siguiente comando desde la consola:

```bash
docker-compose exec app npm run test -- -w
```
> :warning: Para correr este comando se debe tener el docker levantado.

> :bulb: Para levantar el servicio sin los logs:
>  ``` bash
> docker-compose up -d
> ```

Para correr el test de coverage:

```bash
docker-compose exec app npm run coverage -- -w
```

## Documentaci�n de API

Para ver la documentaci�n de las API desde un browser teniendo el servicio levantado se debe acceder a: [http://localhost:8080/api-docs/#](http://localhost:8080/api-docs/#)

## Heroku
*Esta aplicaci�n esta deployada en https://ubademy-g2-payments.herokuapp.com*
