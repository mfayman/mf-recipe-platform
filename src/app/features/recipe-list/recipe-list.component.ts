import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
} from 'rxjs/operators';
import { MealDbService } from '../../core/services/meal-db.service';
import { Recipe } from '../../core/models/recipe.model';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [ReactiveFormsModule, RecipeCardComponent],
  template: `
    <div class="container mx-auto p-4 md:p-8">
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">{{ pageTitle() }}</h1>
      </div>

      <!-- Only show search bar on search page, not category page -->
      @if (isSearchPage()) {
        <div class="max-w-2xl mx-auto mb-8">
          <input
            type="text"
            [formControl]="searchInput"
            placeholder="e.g., Steak, Chicken, Beef..."
            class="w-full px-5 py-3 text-lg text-gray-700 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      }

      @if (isLoading()) {
        <div class="flex justify-center items-center h-40">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
        </div>
      }

      @if (!isLoading() && recipes().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          @for (recipe of recipes(); track recipe.idMeal) {
            <app-recipe-card [recipe]="recipe"></app-recipe-card>
          }
        </div>
      }

      @if (!isLoading() && recipes().length === 0 && searchInput.value) {
        <div class="text-center p-8">
            <p class="text-xl text-gray-500">No recipes found for "{{ searchInput.value }}".</p>
            <p class="text-gray-400">Try searching for something else!</p>
        </div>
      }
    </div>
  `,
})

export class RecipeListComponent implements OnInit {
  private mealDbService = inject(MealDbService);
  private route = inject(ActivatedRoute);

  recipes = signal<Recipe[]>([]);
  isLoading = signal<boolean>(false);
  searchInput = new FormControl('');

  pageTitle = signal<string>('Find a Recipe');
  isSearchPage = signal<boolean>(true);

  ngOnInit(): void {
    const categoryName = this.route.snapshot.paramMap.get('name');

    if (categoryName) {
      // --- CATEGORY PAGE ---
      this.isSearchPage.set(false);
      this.pageTitle.set(`Category: ${categoryName}`);
      this.isLoading.set(true);
      this.mealDbService.filterByCategory(categoryName).subscribe(recipes => {
        this.recipes.set(recipes);
        this.isLoading.set(false);
      });
    } else {
      // --- SEARCH PAGE ---
      this.isSearchPage.set(true);
      this.pageTitle.set('Find a Recipe');
      this.setupSearchFromInput();
      const searchTerm = this.route.snapshot.queryParamMap.get('search');
      this.searchInput.setValue(searchTerm || '');
    }
  }

  setupSearchFromInput(): void {
    this.searchInput.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),

        switchMap(searchTerm => {
          this.isLoading.set(true);
          const term = searchTerm || '';

          // Create two observables: one for name search, one for category filter
          const searchByName$ = this.mealDbService.searchRecipesByName(term);
          const filterByCategory$ = this.mealDbService.filterByCategory(term);

          // Using forkJoin to run both requests in parallel.
          return forkJoin([searchByName$, filterByCategory$]);
        }),
        
        map(([nameResults, categoryResults]) => {
          const combinedResults = [...nameResults, ...categoryResults];

          // Handle possible duplicates
          const uniqueRecipes = new Map<string, Recipe>();
          combinedResults.forEach(recipe => {
            uniqueRecipes.set(recipe.idMeal, recipe);
          });

          return Array.from(uniqueRecipes.values());
        })
      )
      .subscribe((recipes) => {
        this.recipes.set(recipes);
        this.isLoading.set(false);
      });
  }
}