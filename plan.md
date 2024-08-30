# Plan

We'd like to develop an application that allows users to pick a location on a map
and see what books are set in that location.

## UI

```javascript
const action = (coordinates) => {
  const locations = getCloseLocations(coordinates, disatance);
  const books = [];
  for (const location of locations) {
    books.push(...getBooksByLocation(location));
  }
  return books;
};

addEventListener("click", (event) => {
  const coordinates = getCoordinates(event);
  const books = action(coordinates);
  displayBooks(books);
});
```

## Corpus

### Locations

I propose that we compile a list of locations:

```javascript
// Generate from AI: Please generate a list of the 1000 most {popular, important, populus, well-known} cities and other locations in the world.
const locations = ["london", "paris", "new york", "tokyo"];
```

and then turn those locations into coordinates:

```javascript
const coordinatesByLocation = locations.map(location => {
  const coordinates = await fetch(`https://maps.example.com?query=${location}`);
  return coordinates;
});
```

#### Location APIs

- https://developers.google.com/maps/documentation/geocoding/overview
- https://openweathermap.org/api/geocoding-api

### Books

For then each location, we use some api to find books with the given location in descripton

```javascript
const books = await fetch(`https://books.example.com?query=${location}`);
```

and store them in a geo-spacial database with the coordinates:

```javascript
for (const book of books) {
  setDb({..book, coordinates: coordinatesByLocation[location]})
}
```

#### Description APIs

I think that associating books with locations will be _THE MAIN CHALLENGE_ for this project.

I _believe_ this is the Amazon site, but not sure if we can use it:

- https://webservices.amazon.com/paapi5/documentation/register-for-pa-api.html

There are sites that proport that this API, in fac, does not exist for Amazon and that they do it instead:

- https://get.asindataapi.com/try-it-free/
- https://www.rainforestapi.com/

There are some open API, but they lack search by description. Perhaps we can search by title instead?

- https://isbndb.com/apidocs/v2
- https://bookscouter.com/blog/book-databases/
- https://isbnsearch.org/

## Database

We'll need a database that supports Geographical data.

- Supabase supports this: https://supabase.com/docs/guides/database/extensions/postgis

## Map Options

Essentially, we just need to

- be able to click a map and extract the coordinates of the click
- Place markes on a map given coordinates.

Here are some options:

- https://leafletjs.com/
- https://www.mapbox.com/
- https://developers.google.com/maps/documentation/javascript/overview
- https://www.openstreetmap.org/

## Display

We'll need to display a lot of books and their location on a map.
but let's say that there are 100 books in london -- how do we handle this.

Do we display all books in a sidebar?

Do we introduce some sort of (deterministic based on title/isb/etc.) jittering?

Do we place them in a radial pattern?

## Other Explorations

### Google Books API

Could we use the [Google Books API](https://developers.google.com/books) to read through the content
of a books and find locations?

```javascript
const locations = extractLocationsFromBook(book);
for (const location of locations) {
  createNewLocation(coordinate);
}
```

In addition, we would not need a defined set of location from the start, and can use the
https://developers.google.com/maps/documentation/geocoding/overview to identify locations.

#### Pros

- Cheap(er)
- More thorough

#### Cons

- Expensive - more time and processing power

### [Vector] Indexing

We obtain:

- a list of keywords associated with a location (including surrounding locations, visible descriptions, landmarks, etc. )

- a list of keywords (that may or may not include location) associated with a book.
  - This could be from an existing index or generated from AI

We match a location against a book and and return a score. We could even interpret this score as a radial distance from the the location.
This might mitigate the need for a geo-spatial database.
