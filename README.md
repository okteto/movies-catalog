# Movies App

This example shows how to leverage [Okteto](https://okteto.com/) to develop an application based on microservicess.
Each service is deployed from its own git repository using Helm charts.
The application consists of the following components:

- A *React* based [frontend](https://github.com/okteto/movies-frontend-with-divert), using [webpack](https://webpack.js.org) as bundler and *hot-reload server* for development.
- A [rentals](https://github.com/okteto/movies-rentals) service. It has a Java API, a worker in Go, a Kafka broker, and a Postgres database.
- A [catalog](https://github.com/okteto/movies-catalog) service. It has a Node.js API serving data from a MongoDB database.

![Architecture diagram](images/app.png)

### Developing in a partial dev environment with divert

Each developer can deploy just the **rentals** service:

![Partial dev environment](images/partial.png)

And develop on it using its own endpoint. The rest of services are shared with the **staging** environment:

![Divert](images/divert.png)
