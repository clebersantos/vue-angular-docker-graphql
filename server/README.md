### Docker

iniciar o back-end com três contêineres(mongo, mongo-express e api com graphql). 

```
 docker-compose up
```

parar os 3 contêineres

```
docker-compose down
```

ver os contêineres rodando

```
docker ps

```

inspecionar um container

```
docker inspect <id do container>
```
ver os logs de um container 

```
docker logs <id do container>
```

### Mongo

acessar o container do mongo 
```
	docker exec -it <nome ou hash do container> bash
```

acessar o banco
```
	mongo -u root -p example --authenticationDatabase admin

```

### Mongo Express

acessar a interface do admin do mongo utilize o mongo express no endereço 
```
http://localhost:8081/
```

### GraphiQl

Adicionando um novo usuário, se não tiver uma coleção `users` ela será criada.

```
mutation {
  addUser(name: "fulano is a good name") {
    id,
    name
  }
}

```

Buscando todos usuários com `id` e `name`
```
query {
  users {
    id,
    name,
  }
}
```

Atualizando um usuário
```
mutation {
  updateUser(id: "<id>"
  	name: "Ciclano is much better"
  ) {
    id
    name
  }
}
```

Removendo um usuário

```
mutation {
  removerUser(id: "5bdf30286b18dad75e8f0d16") {
    id
    name
  }
}
```


Referências: 
 https://blog.cloudboost.io/a-crud-app-with-apollo-graphql-nodejs-express-mongodb-angular5-2874111cd6a5

