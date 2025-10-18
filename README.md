# Recipe Platform

This application allows users to search for various recipes by name or category, or browse by category. It interacts with the free [The MealDB API](https://www.themealdb.com/api.php) to fetch recipe data.

## Core Technologies

* **Angular 20**: The core frontend framework.
* **Tailwind CSS v4**: For all styling, providing a utility-first approach without any component libraries.
* **TypeScript**: For type safety and robust code.
* **RxJS**: Used for handling asynchronous operations, especially for reactive form inputs and API requests.
* **Angular Signals**: Used for managing local component state and creating derived, reactive values.

## Features

* **Recipe Search**: Users can search for recipes by name or category from the home page or the dedicated search page.
* **Reactive Search Bar**: The search results update in real-time as the user types in the search box on the dedicated search page.
* **Recipe Detail Page**: A clean, detailed view for each recipe, showing ingredients, measurements, and step-by-step instructions including a link to a YouTube video.
* **Fully Responsive Design**: The UI is optimized for all screen sizes, from mobile phones to desktop monitors.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (which includes npm) and the [Angular CLI](https://angular.io/cli) installed on your machine.

```bash
# Install the Angular CLI globally if you haven't already
npm install -g @angular/cli
```

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mfayman/mf-recipe-platform
    cd angular-recipe-platform
    ```

2.  **Install dependencies:**
    This will install Angular, Tailwind CSS, and all other necessary packages.
    ```bash
    npm install
    ```

3.  **Run the development server:**
    This command will build the application and start a local development server at `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
    ```bash
    ng serve
    ```
    You can also use the following to run it and open in your default browser automatically.
    ```bash
    ng serve -o
    ```

The application is now running and accessible in your web browser!

## Project Structure

The codebase is organized into a feature-based structure, which keeps related logic, templates, and styles encapsulated.

```
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   └── recipe.model.ts                 # TypeScript interfaces for API data
│   │   └── services/
│   │       └── meal-db.service.spec.ts         # Unit tests for the meal-db.service.ts file
│   │       └── meal-db.service.ts              # Handles all HTTP requests to The MealDB API
│   │
│   ├── features/
│   │   ├── home/
│   │   │   └── home.component.ts               # The main landing page
│   │   ├── recipe-detail/
│   │   │   └── recipe-detail.component.ts      # The single recipe's details page
│   │   └── recipe-list/
│   │       └── recipe-list.component.ts        # The search/category results page
│   │
│   ├── shared/
│   │   └── components/
│   │       └── category-card/
│   │           └── category-card.component.ts  # A reusable card component for categories
│   │       └── recipe-card/
│   │           └── recipe-card.component.ts    # A reusable card component for recipes
│   │
│   ├── app.component.ts                        # The main application shell (header, footer)
│   └── app.routes.ts                           # Defines the application's routing structure
│
├── main.ts                                     # The entry point of the application, where it is bootstrapped
├── styles.css                                  # Global styles and Tailwind CSS imports
```

## Application Flow

1.  **Home Page (`home.component.ts`):** The user is greeted with a hero section and a search bar. When they search, the application navigates them to the `/recipes` route, passing their search term as a URL query parameter (e.g., `/recipes?search=chicken`). There is also a list of categories provided below the search bar for jumping right into a specific category with the `/category` route (e.g. `/category/Lamb`).

2.  **Recipe List Page (`recipe-list.component.ts`):**
    * This page has two versions, one for providing the results of a category and another as a search page for searching by name or category based on the user's input.
        * Category page version:
            * This component loads and checks the URL to determine if there is a category, and presents the recipes in that category.
        * Search page version:
            * This component loads and checks the URL for a `search` query parameter and returns the results by searching by both name and category and combining the results.
            * As the user types in the search box, the stream debounces the input and fetches new results.
            * If no search input is given, it will return the default results from the API by calling it with an empty string.

3.  **Recipe Detail Page (`recipe-detail.component.ts`):**
    * When a user clicks on a recipe card, they are navigated to `/recipe/:id`.
    * This component extracts the `id` from the route parameters and uses the `MealDbService` to fetch the detailed information for that specific recipe.
    * A `computed` signal is used to transform the flat list of `strIngredient1`, `strMeasure1`, etc., from the API into a clean, iterable array of objects, which is then rendered in the template.
