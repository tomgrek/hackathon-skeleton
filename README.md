# Bootcamp Skeleton

A skeleton (boilerplate) for quickly getting started on coding bootcamp projects. Suitable for prototyping and quick deployment.

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


