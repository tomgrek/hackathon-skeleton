# Deprecated.

This repo is a couple of years old. There are better skeletons out there. Don't use this!

# Hackathon Skeleton

A skeleton (boilerplate) for quickly getting started on hackathons projects. Suitable for prototyping and quick deployment. State-of-the-art, best practices, efficient web development.

This README file also contains **complete** instructions for deploying projects made with this template to a brand new cloud server running Ubuntu 16. No reason to tie yourself to platforms like Heroku when it's all achievable from scratch with only a little bit more effort.

[View a demo](https://twitter-clone-react.exploitip.com) of a simple Twitter-alike made with this skeleton, and [view the source](https://github.com/tomgrek/twitter-clone-react).

You need basic Linux, HTML and JS knowledge to get the most out of this guide and the repo as a whole. If, as a beginner, you follow the guide and apply some trial and error, you might (I hope) gain that knowledge. I try my best to explain jargon when it crops up and am not afraid to oversimplify.

# What's in it?

* Runs on (requires) Node JS (write front- and back-end code in Javascript!)
* Deploys to a Docker container, with Nginx at the front of your server directing requests to the right container. This means you can easily deploy many sites on one server! Docker is basically a lightweight (so, fast) virtual machine.
* Uses Webpack for compilation (transforming new JS syntax for older browsers, using Babel), minifying, live reloading.
* Uses Express for routing / running a back-end server (Express is a common npm package.)
* Front-end is built in Javascript (JSX) using React (React adds a bit of JS to your user's website download, but there really isn't much for you to learn, and webapps become simpler to write - change a variable somewhere and automatically the DOM is updated in the client.)
* Has SASS for compiling CSS (Writing CSS -- styling websites -- is complex, repetitive, and random. SASS helps a bit.)
* Uses Mongo at the backend, providing a database (All non-static websites require a db)
* Has Mocha, Chai, and Zombie for automated tests - back-end *and* front-end! (Tests are considered good practice. They are especially useful when you're working with other people and integrating their code.)

If you want to use Redux (it's probably worth it - redux simplifies React a bit), switch
to [this branch](https://github.com/tomgrek/bootcamp-skeleton/tree/with-redux). If you don't know Redux, well, it enforces some 'good' coding styles, but more importantly, centralizes the state of your app - useful because with many components each having their own local state, using & debugging React can begin to feel like pushing spaghetti up a hill.

If you want to use React Router (client side routing - great for single page apps) in addition to server side routing (so you
	can still have REST endpoints etc), have a look at [this branch](https://github.com/tomgrek/bootcamp-skeleton/tree/with-redux-and-react-router). It
	also includes Redux and animated component transitions.

If you want to use Passport (user login) - together with Redux and React Router, what I'll call a 'full stack' - use [this branch](https://github.com/tomgrek/bootcamp-skeleton/tree/fullstack).

## How to use it?

```
git clone https://github.com/tomgrek/bootcamp-skeleton
npm install -g mocha // so mocha can be run from the command line
cd bootcamp-skeleton
npm install
npm run test // all tests should pass
npm run start_dev // wait while Webpack builds your project
// visit http://localhost:3000 in your browser
// to test as if in production mode, run: NODE_ENV=production PORT=3000 npm run start
```

Note that in development (on your local machine), the app will be almost 3MB (if you check it in Chrome DevTools). This
reduces to about 130K when you build it for production, so don't be alarmed!

Instead of ```npm run start_dev``` you can also run ```npm run start```. The *start_dev* option runs **nodemon**,
which restarts/rebuilds on changes to your *server side* code. (Hot reload only works with front-end.) You'll still
need to reload your browser to view any changes, but at least you don't have to Ctrl-C out of the running node
process first. I've only set up nodemon for dev mode, that is, local machine building and testing. It's not
used by the Docker deployment. Note that if you don't have nodemon installed globally, you will need to
do that in addition to mocha - ```npm install -g nodemon```.

## How did this originate?

I like the black box that is Meteor, but wanted that workflow from the ground up, using all the latest technologies.

See [Christian Alfoni's blog post](http://www.christianalfoni.com/articles/2015_04_19_The-ultimate-webpack-setup) for details on the technical webpack setup. This
project began as a fork of his [repo](https://github.com/christianalfoni/webpack-express-boilerplate).

## How to deploy?

First, you need a server. I use Linode. Deploy a fresh Ubuntu 16.04 and SSH into it. Since this is designed for a bunch of learning projects and not a real deployment, stick with root access for simplicity. If you want to deploy forreals, adding user groups and setting permissions is not that hard. You might then also want to add CSRF protection and header rewriting (see helmet.js).

First, a little bit of sysadmin. Set the machine's time-zone: ```dpkg-reconfigure tz-data```.
Change the SSH port from the default 22 by ```nano /etc/ssh/sshd_config```, then restart the SSH daemon with ```service sshd restart```. From now on, SSH to the server with the -p switch, e.g. ```ssh root@exploitip.com -p 2288```.
This will help mitigate constant root login attempts from machines which seem to be mostly located in China.

Create a non-root user with ```adduser [username]``` then ```usermod -aG sudo [username]```. You can then disable SSH root login in /etc/ssh/sshd_config, and maybe also uncomment the 'Banner' line whilst putting some scary message in /etc/issue.net.

Set up the machine with ```hostname dev``` ('dev' is my machine name here) and by editing /etc/hosts.
You'll need to have a domain name, with DNS (I use Google Domains) pointing to the Linode's IP address. (The domain I use is exploitip.com).

Whilst you're playing with the DNS, create a sub-domain to deploy your project to. Or create many, e.g. project1.exploitip.com, project2.exploitip.com, etc. This guide describes the latter, slightly
more complicated situation, assuming you don't want to spin up a server for each project (until you start to
scale, that is!) But you can easily cut bits out and still follow this guide -- including the Docker bits -- if you want a strictly one project, one (or many) server approach, say if you start getting more traffic. Point each sub-domain at the Linode.

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
* docker kill [[id or name]] (kills a running container)
* docker attach [[id or name]] (gets you the active terminal in that container)
* docker exec -i -t [[id or name]] /bin/bash (starts a new, usable terminal in a running container, useful for troubleshooting)
* docker build -t . (run from the project directory: builds an image according to Dockerfile. Can take awhile)
* docker inspect [[id or name]] (inspects the running container, you can find its relative IP address etc)

Note the dot in the last command above. It's important!

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
git commit // then type the commit message, save and quit. According to my bootcamp, this is better than using the -m "Commit message" switch!
git remote add origin https://github.com/[yourGithubUsername]/[your repo name].git // only do this once
git push origin master
```

Now, back on the server:

```
git clone https://[yourGithubUsername]/[your repo name].git
npm install // install npm/node with apt-get install npm first!
// you may need to use this command: ln -s /usr/bin/nodejs /usr/bin/node
npm run build // runs the 'build' command, see package.json
docker build -t [tag, call it anything lowercase and unique - I'll use 'test' in this guide] .
```

Note the period again at the end of the last line. It'll take a little while to execute, though many of the build
steps are cached (including (unless your package.json has been modified) the 'npm install' step, which is a great time saver.)

Because of the caching, don't delete an image/remove a container before you've re-built the new container, or you'll lose the
benefits. (Although it is perfectly safe to do so.)

Now, before you can run the container, we need to set up Nginx.

## Nginx set up

Your server, with Linode, might cost $10/month for a basic one. We've gone through all this with Docker in order
to get many websites running on the same server. We do this by putting Nginx, a web server, in front.

```
apt-get install nginx
rm -rf /etc/nginx/sites-enabled
mv /etc/nginx/sites-available /etc/nginx/sites-enabled
service nginx restart
```

I don't personally like the way nginx is configured to have sites-available and sites-enabled folders; I always forget which is which. So I delete one. This is probably not best practice but this is a quick starter, not a bulletproof dev-ops guide!

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

find ips from /var/log/mail.log and /var/log/syslog
iptables -L
iptables -I INPUT -s 116.31.116.25 -j DROP
iptables-save
service iptables-persistent save
service iptables-persistent restart

Than run ```service nginx restart```.

You can add many such entries, one for each project you make! It's why you set up sub-domains earlier. Keep a note of the ports you use, as those
are the ones we need to expose from Docker. You can choose any port number that doesn't conflict with a running service, so not e.g. 80 which is HTTP, 443 which is SSL etc.

You may want to edit /var/www/index.html. With a fresh install of nginx, a visitor to the root domain (in my case, exploitip.com or www.exploitip.com) will see a "Welcome to nginx!" message.

#### About SSL (HTTPS)

You can serve each site/sub-domain using both http and https, or just https if you want. By default (i.e. if you don't
do anything from this section), each site will be http only. If that's fine, ignore this section and deem it as
'unnecessary complication'!

For HTTPS, get started with the wonderful Let's Encrypt, by following the guide
at [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04),
as if you were installing SSL on a regular server, except that:

```
./letsencrypt-auto certonly -a webroot --webroot-path=/var/www/html -d example.com -d www.example.com
should be
./letsencrypt-auto certonly -a webroot --webroot-path=/var/www/html -d example.com -d www.example.com -d project1.example.com -d project2.example.com (...etc. Let's Encrypt doesn't support wildcard certificates, so you need to set it up for every sub-domain.)
```

And each sub-domain's server block should look like this:

```
server {
	listen 80; # or leave this out to disable http and permit https only
	listen 443 ssl http2;
	server name project.exploitip.com;
	location / {
		proxy_pass http://127.0.0.1:8081;
	}
}
```

I'll add that the file ```/etc/nginx/snippets/ssl-params.conf``` was missing on my server. I just created a file with
that name, and added one line: ```ssl_protocols TLSv1.1 TLSv1.2;```

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
that is running it in a container. I don't do that. I develop on Ubuntu, and followed the installation instructions [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/).

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

Because a full-stack dev's work is never done.

* Add a dangerouslySetInnerHTML example
* Add Redux for simplified state management across components (DONE)
* Add react-router for ease of making/managing single page apps
* Add optional layout and commonly used components including pagination and auto-complete (separate branch)
* Remove embedded HOWTO code from the JS and put it into this guide instead (maybe)
* Extend guide with React Native for Android/iOS app development (separate branch)
* Extend guide with React Native desktop development info, Windows, Linux, and Mac OS (separate branch)
* Add passport.js/socket.io examples (separate branch)
* Add MQTT/IOT example using ESP8266 (separate branch. I like hardware!)
* Re-do this guide for a Raspberry Pi instead of a cloud server.
