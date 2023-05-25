curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
id -Gn # List the groups you belong to
sudo usermod -aG docker ${USER}
# sudo usermod -aG docker $USER
newgrp docker
groups
sudo chown root:docker /var/run/docker.sock
su - ${USER} # to reload the terminal (must reenter your password)
sudo service docker start
docker version
docker info
docker run hello-world