import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/category', category.strCategory]"
       class="block group text-center p-4 rounded-lg shadow-md hover:shadow-xl bg-white
              hover:bg-orange-500 transition-all duration-300 transform hover:-translate-y-1">
      
      <img class="w-24 h-24 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" 
           [src]="category.strCategoryThumb" 
           [alt]="'Icon for ' + category.strCategory">
      
      <h3 class="font-semibold text-gray-800 group-hover:text-white transition-colors">
        {{ category.strCategory }}
      </h3>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CategoryCardComponent {
  @Input({ required: true }) category!: Category;
}