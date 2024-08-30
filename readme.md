# LiteraryLocations

LiteraryLocations is a web application that allows users to discover books set in specific locations around the world. Users can interact with a map interface to explore literary works associated with different places.

## Features

- Interactive world map with predefined locations
- Click on locations to discover books set there
- View book details and summaries in a sidebar

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later) and npm installed
- Git installed
- A Google Maps API key
- A Google Books API key

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

3. Set up environment variables:
   Create a `.env` file in the root directory of the project and add the following variables:

   ```
   PORT=3000
   DB_PATH=./database.sqlite
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here
   NODE_ENV=development
   ```

   Replace `your_google_maps_api_key_here` and `your_google_books_api_key_here` with your actual API keys.

4. Obtain API Keys:

   a. Google Maps API Key:
      - Go to the [Google Cloud Console](https://console.cloud.google.com/)
      - Create a new project or select an existing one
      - Navigate to the "APIs & Services" dashboard
      - Click on "Enable APIs and Services" and search for "Maps JavaScript API"
      - Enable the Maps JavaScript API
      - Go to the "Credentials" page
      - Click "Create Credentials" and select "API Key"
      - Copy the generated API key and paste it into your `.env` file as GOOGLE_MAPS_API_KEY

   b. Google Books API Key:
      - In the same Google Cloud Console project
      - Navigate to the "APIs & Services" dashboard
      - Click on "Enable APIs and Services" and search for "Books API"
      - Enable the Books API
      - Go to the "Credentials" page
      - Click "Create Credentials" and select "API Key"
      - Copy the generated API key and paste it into your `.env` file as GOOGLE_BOOKS_API_KEY

5. Initialize the database:
   ```
   npm run db:init
   ```

6. Build the React frontend:
   ```
   npm run build
   ```

## Running the Application

1. Start the server:
   ```
   npm start
   ```

2. Open a web browser and navigate to `http://localhost:3000` (or the port specified in your .env file)

## Development

To run the application in development mode with hot reloading:

1. Start the backend server:
   ```
   npm run dev
   ```

2. In a separate terminal, start the React development server:
   ```
   npm run start
   ```

3. Open a web browser and navigate to `http://localhost:3000`

## Testing

To run the test suite:

```
npm test
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Troubleshooting

If you encounter any issues while setting up or running the application, please check the following:

1. Ensure all dependencies are installed by running `npm install` again.
2. Verify that your `.env` file contains all the required variables with correct values.
3. Make sure your API keys are valid and have the necessary permissions enabled.
4. Check the console output for any error messages that might provide more information about the issue.

If you're still having problems, please open an issue on the GitHub repository with a detailed description of the error and the steps to reproduce it.