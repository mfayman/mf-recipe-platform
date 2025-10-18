import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Recipe, RecipeResponse, Category, CategoryResponse } from '../models/recipe.model';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

@Injectable({
  providedIn: 'root',
})
export class MealDbService {
  private http = inject(HttpClient);

  /**
   * Searches for recipes by name.
   * @param name The name of the recipe to search for.
   * @returns An observable of an array of recipes.
   */
  searchRecipesByName(name: string): Observable<Recipe[]> {
    return this.http
      .get<RecipeResponse>(`${API_BASE_URL}/search.php`, {
        params: new HttpParams().set('s', name),
      })
      .pipe(
        map((response) => response.meals || []),
        catchError(this.handleError<Recipe[]>('searchRecipesByName', []))
      );
  }

  /**
   * Fetches the details for a specific recipe by its ID.
   * @param id The unique identifier for the recipe.
   * @returns An observable of a single recipe or null if not found.
   */
  getRecipeById(id: string): Observable<Recipe | null> {
    return this.http
      .get<RecipeResponse>(`${API_BASE_URL}/lookup.php`, {
        params: new HttpParams().set('i', id),
      })
      .pipe(
        map((response) => (response.meals ? response.meals[0] : null)),
        catchError(this.handleError<null>('getRecipeById', null))
      );
  }

  /**
   * Fetches a list of all available meal categories.
   * @returns An Observable that emits an array of Category objects.
   */
  getCategories(): Observable<Category[]> {
    return this.http
      .get<CategoryResponse>(`${API_BASE_URL}/categories.php`)
      .pipe(
        map((response) => response.categories || []),
        catchError(this.handleError<Category[]>('getCategories', []))
      );
  }

  /**
   * Fetches all recipes for a specific category.
   * @param categoryName The name of the category to filter by.
   * @returns An Observable that emits an array of Recipe objects.
   */
  filterByCategory(categoryName: string): Observable<Recipe[]> {
    return this.http
      .get<RecipeResponse>(`${API_BASE_URL}/filter.php`, {
        params: new HttpParams().set('c', categoryName),
      })
      .pipe(
        map((response) => response.meals || []),
        catchError(this.handleError<Recipe[]>('filterByCategory', []))
      );
  }

  /**
   * Handles HTTP operation failures.
   * Lets the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}