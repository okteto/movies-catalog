# Movies App with Divert

This example shows how to leverage [Okteto](https://okteto.com/) to develop an application based on microservices using Divert.
Each service is deployed from its own git repository using Helm charts.
The application consists of the following components:

- A *React* based [frontend](https://github.com/okteto/movies-frontend-with-divert), using [webpack](https://webpack.js.org) as bundler and *hot-reload server* for development.
- A [rentals](https://github.com/okteto/movies-rentals) service. It has a Java API, a worker in Go, a Kafka broker, and a Postgres database.
- A [catalog](https://github.com/okteto/movies-catalog) service. It has a Node.js API serving data from a MongoDB database.

![Architecture diagram](images/app.png)

## Developing in a partial dev environment with divert

First, deploy [catalog](https://github.com/okteto/movies-catalog) repository in a namespace called `staging`. If your namespace has a different name, you will need to update [this line](https://github.com/okteto/movies-rentals/blob/main/okteto.yml#L12).

[catalog](https://github.com/okteto/movies-catalog) deploys [frontend](https://github.com/okteto/movies-frontend-with-divert) and [rentals](https://github.com/okteto/movies-rentals) as dependencies. In particular, [rentals](https://github.com/okteto/movies-rentals) has a [divert directive](https://github.com/okteto/movies-rentals/blob/main/okteto.yml#L11) but it's ignored when it's deployed in the same `staging` namespace.

Once the application is running, you can rent a movies and it will go from "Store" to the list of Cindy's movies.

Now create a new namespace and deploy the [rentals](https://github.com/okteto/movies-rentals). The rentals service is deployed using a the same Okteto Manifests deploy commands, but now the `divert` directive applies. The Okteto CLI will duplicate all the Ingress in the `staging` namespace and create headless services for `frontend` and `catalog`. You can access to the frontend public endpoint in your namespace, and the Movies app should work end to end, consuming the frontend and catalog services in the `staging` namespace.

![Divert](images/divert.png)

Finally, you can run `okteto up` to activate a development container for your own version of the `rentals` service.
