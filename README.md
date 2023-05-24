# test_code_internetprojectltd

## Project context

We have football teams. Each team has a name, country, money balance and players.
Each player has name and surname.
Teams can sell/buy players.

What we need in our app:
- Make a page (with pagination) displaying all teams and their players.
- Make a page where we can add a new team and its players.
- Make a page where we can sell/buy a player for a certain amount between two teams.

## Note

I developed on WSL Linux Ubuntu 20.04 on a virtual machine.

- Install Docker && Docker compose
- `chmod 755 ./install-docker.sh`
- `chmod 755 ./install-docker-compose.sh`

Please review the files before to execute them
- `./install-docker.sh`
- `./install-docker-compose.sh`

1/ Deploy Local Dev Environment
- `sudo service docker start` to start the docker service
- `docker-compose build`
- `docker-compose run --rm --entrypoint=npm frontend ci`
- `docker-compose run --rm backend bash` then inside the container :
    - `chmod 755 ./reset_db.sh` a file which contains commands to reset the tables schema and fixtures
    - `composer install`
    - `Ctrl+D` to exit the container

2/ Run containers
- `docker-compose up -d`
    - wait that all container are running
- `docker ps` to list all running docker containers

3/ Initialize some data fixtures
- `docker exec -it Test_Code_InternetProjectLTD_back bash` to enter inside the container
- Make sure that the `database` docker service is running
- `./reset_db.sh` execute the bash file to reinitiliaze the database with some data
- `Ctrl+D` to exit the container

## Services docker
| Services        | Version               | Path access           |
|:---------------:|:---------------------:|:---------------------:|
| database        | MySQL 8               | port 3306             |
| phpmyadmin      | PHPMyAdmin 5.1.1      | http://localhost:81   |
| backend         | PHP 8.0 / Symfony 6.0 | http://localhost:8001 |
| frontend        | Node 20 / React 18    | http://localhost:3000 |

- phpmyadmin server : `database`
- phpmyadmin username / password : `root` / `ChangeMe`

4/ Stopping all containers or specific
- `docker stop <container name>` to stop specific container
- `docker-compose -f 'docker-compose.yml' stop` to stop all containers inside the project

5/ Down all containers
- `docker-compose -f 'docker-compose.yml' down` to remove the containers network
