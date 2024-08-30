# LiteraryLocations

LiteraryLocations is a web application that allows users to discover books set in specific locations around the world. Users can interact with a map interface to explore literary works associated with different places.

## Features

- Interactive world map
- Click on locations to discover books set there
- View book details and summaries
- Search for specific locations or books

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/LiteraryLocations.git
   cd LiteraryLocations
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables (see Environment Variables section below)

4. Initialize the database:
   ```
   npm run db:init
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

```
PORT=3000
DB_PATH=./database.sqlite
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
BOOK_API_KEY=your_book_api_key_here
NODE_ENV=development
LOG_LEVEL=info
JWT_SECRET=your_jwt_secret_here
```

Here's what each variable means and how to obtain it:

- `PORT`: The port on which your server will run. 3000 is a common default.

- `DB_PATH`: The path to your SQLite database file. You can keep the default `./database.sqlite` unless you want to store it elsewhere.

- `GOOGLE_MAPS_API_KEY`: Required for using Google Maps in the frontend. 
  - Obtain from: [Google Cloud Console](https://console.cloud.google.com/)
  - Enable the Maps JavaScript API for your project
  - Create credentials (API key) for Maps JavaScript API

- `BOOK_API_KEY`: API key for fetching book data. The source depends on which book API you decide to use. Some options:
  - [Google Books API](https://developers.google.com/books/docs/v1/using)
  - [Open Library API](https://openlibrary.org/developers/api) (doesn't require an API key)
  - [New York Times Books API](https://developer.nytimes.com/docs/books-product/1/overview)

- `NODE_ENV`: Specifies the environment. Use `development` for local development, `production` for deployment.

- `LOG_LEVEL`: Determines the verbosity of logging. Common values are `error`, `warn`, `info`, `debug`.

- `JWT_SECRET`: A secret key for JSON Web Token encryption. Generate a strong, random string for this.

Remember to never commit your `.env` file to version control. Add it to your `.gitignore` file to prevent accidental commits.

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the production version
- `npm start`: Start the production server
- `npm run db:init`: Initialize the SQLite database
- `npm test`: Run the test suite

## Testing

This project uses Node.js's built-in test runner and assertion library. To run the tests, use the following command:

```
npm test
```

The tests cover core functionality including database operations and API endpoints. If you add new features or modify existing ones, please update or add tests accordingly.

## Technologies Used

- Node.js
- Express.js
- SQLite
- React
- Leaflet.js

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.