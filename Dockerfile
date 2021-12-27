FROM node:12

RUN apt-get update && apt-get -y install vim net-tools

# Add Datadog repository and signing keys
RUN sh -c "echo 'deb https://apt.datadoghq.com/ stable 7' > /etc/apt/sources.list.d/datadog.list"
RUN apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 A2923DFF56EDA6E76E55E492D3A80E30382E94DE
RUN apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 D75CEA17048B9ACBF186794B32637D44F14F620E

# Install the Datadog agent
RUN apt-get update && apt-get -y --force-yes install --reinstall datadog-agent

WORKDIR /app
COPY package*.json ./

RUN npm install nodemon
RUN npm install --production

COPY . .

# Copy Datadog configuration
COPY heroku/datadog-config/ /etc/datadog-agent/

EXPOSE $PORT
# Use heroku entrypoint
CMD ["/app/heroku/heroku-entrypoint.sh"]
