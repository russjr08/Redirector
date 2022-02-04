# Redirector

Redirector is a small link shortener project that I put together - because why use an existing link shortener when you can build your own?!

Note that there is no front-end, Redirector is intentionally designed to be RESTful to manage redirections. Personally, I will probably be pairing this with a Discord Bot (I'll of course publish that and link it here if/when it's ready).

## Requirements
- A "recent-ish" version of Node.js
- An open HTTP port (uses 9500 by default)
- A MongoDB server, for redirect data to be stored to

## Running (via Node.js)
Redirector will need some environmental variables set, in order to get up and running, these are as follows:

      - MONGO_USERNAME=accessor # MongoDB Username
      - MONGO_PASSWORD=insert-secure-password # MongoDB Password
      - MONGO_DATABASE=redirector # MongoDB Database
      - MONGO_HOST=db # MongoDB Hostname
      # - HOST_UNDER=/path # Optional: If you are running this behind a subfolder, uncomment this - do not add a trailing / at the end
      - APP_PORT=9500 # Port to bind HTTP server on
      - API_KEY=enter-your-key-here # Used for basic auth on API requests

Check your operating system's documentation on setting up environmental variables, however if running from say Bash on Linux you can simply just prepend the variable names listed, before the execution command (`VAR1=test VAR2=test node src/index.js`).

## Running (Docker)
Redirector is available as a Docker image on my repository, as the following:
- `docker-registry.omnicron.dev/redirector:latest`: This will get you the latest version of Redirector
- `docker-registry.omnicron.dev/redirector:v1`: This will get you the latest version of Redirector from the v1 branch

I recommend pairing this with the `.env` file from this repository, which has the environmental variables you need for the application. Then you can just pass `--env-file` to Docker, rather than listing all of the variables individually. However, you can list them individually if you wish!

Run with something such as:
`docker run --env-file ./.env -p 10000:9500 docker-registry.omnicron.dev/redirector:v1`

This will make Redirector available on port 10000, connected to the database details specified in the `.env` file.

## Running (Docker Compose)
Don't have an existing MongoDB server? Or do you just prefer to keep your services and it's dependencies coupled together? No problem! You can use the `docker-compose.yml` file from this repository as well, and then just simply use:

`docker-compose up -d`

This will come with a MongoDB server and already have it properly linked to Redirector. I do recommend you make sure to change the `API_KEY` environmental variable, though!

## Usage

Since Redirector is RESTful, you can interact with the API via different HTTP requests. You can find the API docs under the [docs/api_doc.yaml file](docs/api_doc.yaml) which should explain the API. This was created using [Stoplight Studio](https://stoplight.io/studio/) so try opening it into there!

For example, to create a Redirect, you can make the following cURL call:

```
curl --request POST \
  --url http://localhost:9500/to/api/redirects/new \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --header 'x-api-key: enter-your-key-here' \
  --data redirect_from=github \
  --data redirect_to=https://github.com/russjr08
```

Then head over to `http://ip-here:PORT/github` and you would be taken to https://github.com/russjr08

For actual use of course, I would recommend putting Redirector behind a reverse proxy of your choice. Redirector doesn't require any special configuration on it's part if you choose to do this - though if you are going to serve it under a subfolder, be sure the `HOST_UNDER` environmental variable (see "Running (Node.js)" or `docker-compose.yml` or `.env`) gets set!