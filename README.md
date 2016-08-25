# Bootcamp Skeleton

A skeleton (boilerplate) for quickly getting started on coding bootcamp projects. Suitable for prototyping and quick deployment.

This README file also contains complete instructions for deploying projects made with this template to a brand new cloud server running Ubuntu.

# What's in it?

* Runs on (requires) Node JS
* Deploys to a Docker container, with Nginx at the front of your server directing requests to the right container. This means you can easily deploy many sites on one server!
* Uses Webpack for compilation, minifying, live reloading
* Uses Express for routing / running a back-end server
* Front-end is built in Javascript (JSX) using React
* Has SASS for compiling CSS
* Uses Mongo at the backend, providing a database
* Has Mocha, Chai, and Zombie for automated tests - back-end *and* front-end!

## How to use it? 

```
git clone https://github.com/tomgrek/bootcamp-skeleton
npm install -g mocha // so mocha can be run from the command line
cd bootcamp-skeleton
npm install
npm run test // all tests should pass
npm run start // wait while Webpack builds your project
// visit http://localhost:3000 in your browser
```

## How to deploy?

First, you need a server. I use Linode. Deploy a fresh Ubuntu 16.04 and SSH into it. Since this is a bunch of projects and not a real deployment, stick with root access for simplicity.

Set the machine's time-zone: ```dpkg-reconfigure tz-data```.

Set up the machine with ```hostname dev``` ('dev' is my machine name here) and by editing /etc/hosts.
You'll need to have a domain name, with DNS (I use Google Domains) pointing to the Linode's IP address. (The domain I use is exploitip.com).

Whilst you're playing with the DNS, create a sub-domain to deploy your project to. Or create many, e.g. project1.exploitip.com, project2.exploitip.com, etc. Point them at the Linode.

Next, run (as root) ```apt-get update && apt-get install dmsetup```. Then run ```dmsetup mknodes```. I don't know what dmsetup does, only that due to some incompatibility
between Docker and Ubuntu 16, you need to do this before installing Docker, otherwise the install hangs.

Then run ```apt-get install apt-transport-https ca-certificates```.

Next, following the Docker install instructions at https://docs.docker.com/engine/installation/linux/ubuntulinux/ :
```
apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
nano /etc/apt/sources.list.d/docker.list // then add this line:
deb https://apt.dockerproject.org/repo ubuntu-xenial main // save and close (Ctrl-O, Ctrl-X)
apt-get update
apt-get install linux-image-extra-$(uname -r) linux-image-extra-virtual // may not work, if so that's fine
apt-get install docker-engine
service docker start
docker run hello-world // verify it's working
```

Next to get Docker exposed to the outside world. 

```
service ufw status // check if firewall is running. If so...:
nano /etc/default/ufw // then change the forwarding policy line to this:
DEFAULT_FORWARD_POLICY = "ACCEPT" // save and close
service ufw restart
systemctl enable docker
docker run -d -p 80:80 tutum/hello-world
```

Then, from your local machine, open your domain name in your browser. No subdomains yet, i.e. for me I just visit http://exploitip.com. You should see the Hello World page.

Docker has downloaded the tutum/hello-world image from DockerHub, and is running it in a container. Docker maps outside port 80 (HTTP) to the container's port 80.

I like to run Docker in a 'screen', that is, a perpetually running terminal on the machine.

```
apt-get install screen
screen // now you get a new terminal
// then run the docker container as above
// then use ctrl-A then ctrl-D to leave the screen. Whatever is in there is still running.
// You can use screen -x to return to the screen at any point later, even if you have left the SSH session etc.
```

### A bit more about Docker

Useful commands for Docker:

* docker ps (shows running containers)
* docker images (these build up, so clean house now and again)
* docker rmi (deletes an image)
* docker rm (removes a container)
* docker kill [id or name] (kills a running container)
* docker attach [id or name] (gets you the active terminal in that container)
* docker exec -i -t [id or name] /bin/bash (starts a new, usable terminal in a running container, useful for troubleshooting)
* docker build -t . (run from the project directory: builds an image according to Dockerfile. Can take awhile)

When you build a Docker image you can move it between machines and run it, and it should work. However, Docker images are BIG, so this is impractical. Instead,
you're going to use Github to transfer stuff between your local machine and the server.

## Using Github to deploy to Docker

You've cloned the repository, and in its directory there will be a .git directory (it may be hidden; see it with ```ls -al```).
You want to make a new repo for your project, so delete the .git directory (```rm -rf .git```, from inside the project directory)

Edit .gitignore and tell git to ignore the following files, by adding these lines:

```
node_modules
.DS_Store
dist
*.log
```

Create a new repo on Github, then do the following to upload your code:

```
git init
git status // see what's changed. Use this often
git add .
git commit // then type the commit message, save and quit. Better than using the -m "Commit message" switch!
git remote add origin https://github.com/[yourGithubUsername]/[your repo name].git // only do this once
git push origin master
```

Now, back on the server:

```
git clone https://[yourGithubUsername]/[your repo name].git
npm install // install npm/node with apt-get install npm first!
// you may need to use this command: ln -s /usr/bin/nodejs /usr/bin/node
npm run build // runs the 'build' command, see package.json
docker build -t [tag, call it anything, I'll use 'test' in this guide] .
```

But, before you can run the container, we need to set up Nginx.

## Nginx set up

Your server, with Linode, might cost $10/month for a basic one. We've gone through all this with Docker in order
to get many websites running on the same server. We do this by putting Nginx, a web server, in front.

```
apt-get install nginx
rm -rf /etc/nginx/sites-enabled 
mv /etc/nginx/sites-available /etc/nginx/sites-enabled
service nginx restart
```

I don't personally like the way nginx is configured to have sites-available and sites-enabled folders; I always forget which is which. So I delete one. This is probably
bad practice but this is a quick starter, not a bulletproof dev-ops guide!

Next, edit /etc/nginx/sites-enabled/default

Add a new server block, as follows:

```
server {
	server name project.exploitip.com;
	location / {
		proxy_pass http://127.0.0.1:8081;
	}
}
```

You can add many such entries, one for each project you make! It's why you set up sub-domains earlier. Keep a note of the ports you use, as those
are the ones we need to expose from Docker. You can choose any port number that doesn't conflict with a running service, so not e.g. 80 which is HTTP, 443 which is SSL etc.

### Test the configuration

```
screen docker run -d --name MyContainer -p 127.0.0.1:8081:80 tutum/hello-world
```

Here, 'test' is the name of the image you build earlier, and 8081 is the port you specified in the Nginx configuration file.

From your local machine, visit the subdomain in your browser (e.g. http://project1.exploitip.com) to check it works.

## Installing Mongo

This *still* isn't enough to run the bootcamp-skeleton project, because it requires Mongo. We run Mongo in a separate Docker container, where it is
shared among the many projects you might make based off this skeleton.

Not much to do here, since DockerHub has a ready-rolled Mongo image:

```
screen docker run --restart=always --name devMongo -p 27017:27017 -d mongo // then Ctrl-A Ctrl-D to detach from the 'screen' terminal
apt-get install mongodb-clients
```

During development, you'll also need Mongo installed on your local machine. You *could*, I suppose, do it in the same way as on the server,
that is running it in a container. I don't do that. I develop on Ubuntu, and followed the installation instructions (here)[https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/].

### Useful mongo commands

```
mongo // opens a terminal
db.createUser({user:'tomgrek', pwd:'mypassword', roles:[{role:'userAdminAnyDatabase', db:'admin'}]});
show dbs
use project1 // creates and switches to the 'project1' database, matching your first project
show collections
db.project1.insert({name:'my first item'});
db.project1.find({}) // returns 1 result, 'my first item'
exit // your changes to the project1 collection are saved/persistent
```

Note that the schema name in the project code is pluralized. So in the project code we have ```Name```, this
becomes ```names``` when using the mongo command line client.

## Finally, you can run the project

Be sure to kill any old, useless running containers first (e.g. tutum/hello-world - you should also delete that image). But don't kill the running Mongo container!

```
screen docker run -d --restart=always --name MyProject --link devMongo:devMongo -p 127.0.0.1:8081:3000 test
// the -d switch means 'run detached' or in the background.
// the restart=always switch means the container will start up again if it crashes, or the machine reboots
```

Now you can visit http://project1.exploitip.com (or whatever domain and sub-domain you are using) in your browser. Viola!
 
# TODO

* Use pm2 to manage the running node process
