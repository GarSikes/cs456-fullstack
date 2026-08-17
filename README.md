# Travlr Getaways

A full stack MEAN application built across CS 465 (Full Stack Development I), covering a public customer-facing travel catalog and a secured administrative single-page application for managing trips.

## Overview

Travlr Getaways started as a static Express site and grew, module by module, into a complete full stack application. The customer side renders trip listings through server-side Handlebars views backed by MongoDB, while the admin side is a separate Angular SPA that consumes a RESTful API to create, edit, and delete trips. Administrative actions are protected behind JWT-based authentication, so only logged-in users can modify trip data.

## Features

- Customer-facing Travel page listing all available trips, rendered server-side with Handlebars
- RESTful API (`/api/trips`, `/api/trips/:tripCode`) built with Express and Mongoose
- Angular admin SPA with trip listing, add-trip, and edit-trip views
- Reusable `trip-card` and `trip-listing` components built with Bootstrap
- JWT authentication (`/api/register`, `/api/login`) securing the create and update endpoints
- MongoDB database with a Mongoose-validated trip schema

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, jsonwebtoken, passport-local, cors, dotenv
**Frontend (customer):** Express with Handlebars (`hbs`) templating
**Frontend (admin):** Angular, TypeScript, Bootstrap, Angular Reactive Forms
**Tools:** Postman (API testing), Git/GitHub (version control)

## Project Structure

```
travlr/
├── app_server/       # Handlebars views, controllers, and routes for the customer site
├── app_api/          # RESTful API: models, controllers, and routes (trips, auth)
├── app_admin/         # Angular admin SPA
├── data/             # Seed data (trips.json)
└── app.js            # Express entry point
```

## Setup & Installation

1. Clone the repository and install backend dependencies from the project root:
   ```
   npm install
   ```
2. Install the Angular admin app's dependencies:
   ```
   cd app_admin
   npm install
   ```
3. Create a `.env` file in the project root with your MongoDB connection string and a JWT secret:
   ```
   DB_URI=<your MongoDB connection string>
   JWT_SECRET=<your secret>
   ```
4. Start the Express server from the project root:
   ```
   npm start
   ```
   The customer site and API run at `http://localhost:3000`.
5. In a separate terminal, start the Angular admin app:
   ```
   cd app_admin
   ng serve
   ```
   The admin SPA runs at `http://localhost:4200`.
6. Register an admin account through the SPA's login/register form to access the Add/Edit/Delete trip features.

## Portfolio Journal Reflection

### Architecture

**Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).**

The Travlr Getaways project moved through three distinct approaches to the frontend, and each one taught me something different about where rendering should happen. The earliest version served static HTML straight out of Express's `public` folder, which was simple but completely disconnected from any data source. Converting the app to Handlebars views changed that: the server compiled data into HTML on every request, using partials for shared layout pieces and a `{{#each}}` loop to render trips pulled from a JSON file and later MongoDB. It worked, but every interaction, including logging in or adding a trip, meant a full page reload and a round trip to the server just to reflect a UI change.

Building the admin side as an Angular SPA solved that problem. Once the app loads, navigating between the trip listing, add-trip, and edit-trip views is just a data fetch, not a full page reconstruction, so it feels noticeably faster after that first load. The bigger win was around authentication: using a signal to track login state meant the navbar and the Add/Edit/Delete buttons updated instantly the moment a user logged in or out, with no polling and no refresh. The tradeoff is that the SPA carries more weight in the browser itself, since the whole app and its state stay loaded client-side for the session, so it's a real tradeoff between server simplicity and client responsiveness rather than a strict upgrade.

**Why did the backend use a NoSQL MongoDB database?**

MongoDB fit the shape of the data I was working with better than a relational database would have. Trip records are naturally self-contained documents (name, code, length, price, image, description) with no real need for joins across tables, so storing each trip as a single JSON-like document meant the data model looked almost identical at every layer of the stack, from the Mongoose schema to the API response to the object Angular consumed. That consistency mattered more as the project grew: the Mongoose schema still gave me validation on required fields and data types, but I didn't have to define a rigid table structure up front while the app's requirements were still changing module to module. MongoDB also paired naturally with the rest of the MEAN stack, since everything from the database driver to the API to the frontend was already speaking JavaScript and JSON, so there was no translation layer needed between the database and the rest of the application.

### Functionality

**How is JSON different from JavaScript and how does JSON tie together the frontend and backend development pieces?**

JSON is a text-based data format, not a programming language. It borrows its syntax from JavaScript object literals, but a JSON document can't contain functions, comments, or logic, and it isn't tied to JavaScript at all; it's meant to represent data in a structure any language can parse. JavaScript, by contrast, is the full programming language that can create, read, and manipulate that data.

That distinction is exactly what made JSON so useful for tying the stack together. A trip stored as a MongoDB document comes back through Mongoose already shaped like a JSON object. The Express API sends that object over HTTP as JSON with no reformatting needed. Angular's `HttpClient` receives that JSON and it becomes a native JavaScript (TypeScript) object I could bind directly into a component and render in a template. The same data shape moved through the database, the API layer, and the frontend without ever needing to be translated into something else along the way, which is a big part of what made the MEAN stack feel cohesive rather than like four separate systems bolted together.

**Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.**

Two refactors stand out. The first was splitting the API into its own `app_api` folder in Module 5, moving models, controllers, and routes out of `app_server` so the customer-facing views and the RESTful API were no longer tangled together. That separation made it possible to build the Angular admin app against the API independently, without touching the Handlebars side at all. The second was pulling the trip card markup out of `trip-listing` and into its own `trip-card` component with an `@Input() trip` binding. I'd originally built the card markup directly inside the listing component, and refactoring it into its own component (after working through a circular-import bug caused by pasting the wrong content into the new file) meant the listing component only had to manage the array of trips and loop over `trip-card` instances.

That second refactor is a good example of what reusable components buy you: a single source of truth for how a trip is displayed, so a styling or layout change only has to happen in one place instead of everywhere a trip is rendered. It also made the component easier to test and reason about in isolation, and it set up the codebase to add new views (like a trip detail page) later without duplicating markup.

### Testing

**Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.**

Each HTTP method maps to a specific kind of operation on an endpoint: GET retrieves data (the trip listing and single-trip lookups), POST creates a new resource (adding a trip, registering a user), PUT updates an existing resource (editing a trip), and DELETE removes one. Each endpoint, like `/api/trips` or `/api/trips/:tripCode`, can support more than one of those methods, so testing means confirming each method behaves correctly against that same URL, not just that the endpoint "works."

Adding JWT authentication made testing more involved because the correct response now depended on more than just the request itself. I used Postman to confirm that GET and DELETE on `/api/trips` still worked with no token, matching the design decision to leave read access open, while POST and PUT required a valid Bearer token, returning 401 Unauthorized without one or with an altered token, and 201 or 200 with a valid one. That meant testing each protected endpoint at least three times: no token, a bad or tampered token, and a legitimate token obtained by actually logging in through `/api/login` first. It was a good reminder that security testing isn't just checking that the happy path works, it's deliberately trying to break the auth layer and confirming it holds.

### Reflection

**How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?**

This course gave me my first real experience building a complete application end to end rather than a single piece of one, and that full picture is what I think will matter most going forward. I moved through the entire stack: serving static content, moving to server-rendered views backed by a database, building out a RESTful API, and finally building a separate client application that consumes it. Each module forced me to understand not just how to write the code for that layer, but why that layer exists and how it depends on the ones around it.

The last module was the most directly relevant to where I want to take my career. Adding JWT authentication meant thinking about the system from an attacker's perspective as much as a developer's: which endpoints actually needed protection, what a forged or missing token should do, and how to verify with real testing (not just assumption) that the security layer actually held. That's the kind of thinking I want to keep building on for a cybersecurity-focused path, and having hands-on experience securing a real API rather than just reading about JWTs makes that experience something I can point to directly in an interview.
