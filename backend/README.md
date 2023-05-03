# NestJS REST API - RatherGovernor

This is a simple NestJS API for the Ratherlabs fullstack challenge with only one endpoint. This endpoint allows users to retrieve a list of proposals by a GET method to /proposals.

### Getting Started

To get started with this project, follow these steps:

* Clone this repository
* Install the dependencies by running `npm install` or `yarn install`
* Start the server by running `npm start` or `npm start:dev` to see live changes.

## Endpoint

This API has only one endpoint, that retrieves a list of proposals.

Request
```
GET /proposals
```

Response
```
[
  {
    "id": "id_1",
    "title": "title_1",
    "description": "description_1",
    ...
  },
  {
    "id": "id_2",
    "title": "title_1",
    "description": "description_1",
    ....
  }
]
```

# Configuration

This API doesn't use environment variables for configuration as it's only a Proof of Concept.

PORT: The port number to listen on. Defaults to 3001.

# Comments

There is a lot of room for improvements in this backend repository, but I have focused on building something functional without dwelling too much on each of the details. If you ever get to this code, do not use it in production since it is not completely finished and it is just a PoC.

# License

No License.