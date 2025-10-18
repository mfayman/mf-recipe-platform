import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((c) => c.HomeComponent),
    title: 'Home',
  },
  {
    path: 'recipes',
    loadComponent: () =>
      import('./features/recipe-list/recipe-list.component').then((c) => c.RecipeListComponent),
    title: 'Recipes',
  },
  {
    path: 'recipe/:id',
    loadComponent: () =>
      import('./features/recipe-detail/recipe-detail.component').then((c) => c.RecipeDetailComponent),
    title: 'Recipe Details',
  },
  {
    path: 'category/:name',
    loadComponent: () =>
      import('./features/recipe-list/recipe-list.component').then(
        (c) => c.RecipeListComponent
      ),
    title: 'Category Recipes',
  },
  { path: '**', redirectTo: '' }, // Redirect to home for any unknown paths
];