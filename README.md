# CowsayAPI
Create a simple API which can make speak a cow


Please download the Repo "CowsayAPI".

Using the terminal please access the subfolder "CowsayAPI" and run the following commands.

# 1) Steps to follow to dockerize the database MongoDB:

docker network create mynetwork
docker run --name mongodb-container --hostname mongodb-container -d -p 27017:27017 --network mynetwork mongo
docker cp /Users/Franziska/Documents/CowsayAPI/db/users.json mongodb-container:/users.json    —> docker cp <your-local-path-to-json-file>/users.json mongomock:/users.json 
docker exec -it mongodb-container mongoimport --db mock_database --collection users --file /users.json --jsonArray
  
# 2) Steps to follow to dockerize la API:
docker build -t cowsay/node-api .
docker run -p 8080:8080 -d --name cowsay-node-api --network mynetwork cowsay/node-api 
  

You can use the extensions in VisualStudioCode (or any other ide) of Postman or Thunderclient to test the routes.
  


