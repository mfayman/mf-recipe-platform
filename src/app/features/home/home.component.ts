import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MealDbService } from '../../core/services/meal-db.service';
import { Category } from '../../core/models/recipe.model';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CategoryCardComponent],
  template: `
    <div class="relative text-center bg-gray-800 text-white py-24 px-4">
      <div
        class="absolute inset-0 bg-cover bg-center opacity-30"
        style="background-image: url('https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg');">
      </div>

      <div class="relative z-10">
        <h1 class="text-5xl font-extrabold mb-4 drop-shadow-lg">Recipe Platform</h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto drop-shadow">
          Discover delicious and easy-to-make recipes from around the world.
        </p>
        <div class="max-w-2xl mx-auto flex">
          <input
            type="text"
            [formControl]="searchInput"
            (keyup.enter)="onSearch()"
            placeholder="What are you hungry for?"
            class="w-full px-5 py-3 text-lg text-gray-700 border-2 border-transparent rounded-l-full focus:outline-none focus:border-orange-500 bg-white"
          />
          <button
            type="button"
            (click)="onSearch()"
            class="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-r-full transition-colors">
            Search
          </button>
        </div>
      </div>
    </div>

    <div class="py-16 bg-gray-50">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">Browse by Category</h2>

        @if (isLoading()) {
          <p class="text-gray-500">Loading categories...</p>
        }

        @if (categories().length > 0) {
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            @for (category of categories(); track category.idCategory) {
              <app-category-card [category]="category"></app-category-card>
            }
          </div>
        }
      </div>
    </div>
  `,
})

export class HomeComponent {
  private router = inject(Router); private mealDbService = inject(MealDbService);
  searchInput = new FormControl('');

  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.mealDbService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Could not load categories.');
        this.isLoading.set(false);
        console.error(err);
      },
    });
  }
  
  /**
   * Navigates to the recipe list page with the current search term
   * as a query parameter.
   */
  onSearch(): void {
    const searchTerm = this.searchInput.value?.trim();
    if (searchTerm) {
      this.router.navigate(['/recipes'], { queryParams: { search: searchTerm } });
    }
  }
}