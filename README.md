# Co-space API & Data Specification

Co-space provide all information you need about coworking spaces in indonesia.

## Tech Stack

- Node.js
- Yarn
- Express.js / Sails.js
- MongoDB, Mongoose, MongoDB Atlas
- Travis CI
- Heroku

--------------------------------------------------------------------------------

## Development

### Application

Install `yarn` with `npm`

```sh
npm install -g yarn
```

### Running

```sh
yarn install
yarn dev
```

--------------------------------------------------------------------------------

## Deployment

### Infrastructure

GitHub => Heroku => CloudFlare 

### Application

`node` => `pm2`

### Running

```sh
heroku login
yarn deploy
```

Access:

--------------------------------------------------------------------------------

## Data Models

### Coworking_spaces

```json
{
  "_id": ObjectId,
}
```

### Accounts

```json
{
  "_id": ObjectId,
}
```
### Bookings

```json
{
  "_id": ObjectId,
}
```

--------------------------------------------------------------------------------

## API Endpoints

Root URL: `http://localhost:3000`

### Coworking_spaces

### Accounts

### Bookings

--------------------------------------------------------------------------------

## License

[MIT License](./LICENSE)
