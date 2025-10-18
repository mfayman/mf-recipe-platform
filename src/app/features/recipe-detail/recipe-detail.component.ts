import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, finalize } from 'rxjs/operators';
import { MealDbService } from '../../core/services/meal-db.service';
import { Recipe } from '../../core/models/recipe.model';

// Interface for ingredient list
interface Ingredient {
  name: string;
  measure: string;
}

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [],
  template: `
    <div class="p-4 md:p-8">
      @if (isLoading()) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        </div>
      }

      @if (error()) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
          <strong class="font-bold">Error:</strong>
          <span class="block sm:inline">{{ error() }}</span>
        </div>
      }

      @if (recipe(); as r) {
        <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <img class="w-full h-64 md:h-96 object-cover" [src]="r.strMealThumb" [alt]="'Image of ' + r.strMeal">

          <div class="p-6 md:p-8">
            <h1 class="text-3xl md:text-5xl font-bold text-gray-900 mb-2">{{ r.strMeal }}</h1>
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">{{ r.strCategory }}</span>
              <span class="bg-sky-100 text-sky-800 text-sm font-medium px-3 py-1 rounded-full">{{ r.strArea }}</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div class="lg:col-span-1">
                <h2 class="text-2xl font-semibold text-gray-800 border-b-2 border-orange-300 pb-2 mb-4">Ingredients</h2>
                <ul class="space-y-2">
                  @for (ing of ingredients(); track ing.name) {
                    <li class="flex justify-between">
                      <span class="text-gray-700">{{ ing.name }}</span>
                      <span class="font-light text-gray-500">{{ ing.measure }}</span>
                    </li>
                  }
                </ul>
              </div>

              <div class="lg:col-span-2">
                <h2 class="text-2xl font-semibold text-gray-800 border-b-2 border-orange-300 pb-2 mb-4">Instructions</h2>
                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ r.strInstructions }}</p>

                @if (r.strYoutube) {
                  <a [href]="r.strYoutube" target="_blank" class="inline-block mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                    Watch on YouTube
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      } @else if (!isLoading() && !error()) {
        <p class="text-center text-gray-500 mt-12">Recipe not found.</p>
      }
    </div>
  `,
})

export class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private mealDbService = inject(MealDbService);

  recipe = signal<Recipe | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Transform the raw recipe data into a clean array of ingredients and their measurements.
  ingredients = computed<Ingredient[]>(() => {
    const currentRecipe = this.recipe();
    if (!currentRecipe) {
      return [];
    }

    const ingredientsList: Ingredient[] = [];
    // The API has up to 20 ingredients
    for (let i = 1; i <= 20; i++) {
      const ingredient = currentRecipe[`strIngredient${i}` as keyof Recipe] as string;
      const measure = currentRecipe[`strMeasure${i}` as keyof Recipe] as string;

      if (ingredient) {
        ingredientsList.push({ name: ingredient, measure: measure });
      }
    }
    return ingredientsList;
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) {
            this.error.set('No recipe ID provided.');
            this.isLoading.set(false);
            return [];
          }
          this.isLoading.set(true);
          this.error.set(null);
          return this.mealDbService.getRecipeById(id).pipe(
            finalize(() => this.isLoading.set(false))
          );
        })
      )
      .subscribe({
        next: (data) => this.recipe.set(data),
        error: (err) => {
          this.error.set('Failed to load recipe details. Please try again later.');
          console.error(err);
        }
      });
  }
}