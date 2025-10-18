import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Recipe } from '../../../core/models/recipe.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (recipe) {
      <a [routerLink]="['/recipe', recipe.idMeal]" 
         class="block group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
        
        <img class="w-full h-48 object-cover" [src]="recipe.strMealThumb" [alt]="recipe.strMeal">
        
        <div class="p-4">
          <h3 class="font-bold text-lg truncate group-hover:text-orange-600 transition-colors">
            {{ recipe.strMeal }}
          </h3>
        </div>
      </a>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;
}