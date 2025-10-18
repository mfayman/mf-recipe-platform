import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MealDbService } from './meal-db.service';
import { Recipe, Category } from '../models/recipe.model';

// Main describe block for the MealDbService tests
describe('MealDbService', () => {
  let service: MealDbService;
  let httpTestingController: HttpTestingController;
  const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

  // beforeEach runs before each test case
  beforeEach(() => {
    // Configure the testing module
    TestBed.configureTestingModule({
      // Import HttpClientTestingModule to mock HTTP requests
      imports: [HttpClientTestingModule],
      // Provide the service to be tested
      providers: [MealDbService],
    });
    // Inject the service and the mocking controller
    service = TestBed.inject(MealDbService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  // afterEach runs after each test case
  afterEach(() => {
    // Verify that there are no outstanding HTTP requests
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Describe block for the 'searchRecipesByName' method
  describe('searchRecipesByName', () => {
    it('should return an array of recipes on success', () => {
      const mockRecipes: Recipe[] = [{ idMeal: '1', strMeal: 'Test Recipe' } as Recipe];
      const searchTerm = 'Test';

      // Call the service method
      service.searchRecipesByName(searchTerm).subscribe((recipes) => {
        expect(recipes.length).toBe(1);
        expect(recipes[0].strMeal).toBe('Test Recipe');
      });

      // Expect a GET request to the correct URL
      const req = httpTestingController.expectOne(`${API_BASE_URL}/search.php?s=${searchTerm}`);
      expect(req.request.method).toBe('GET');
      // Respond with mock data
      req.flush({ meals: mockRecipes });
    });

    it('should handle API errors and return an empty array', () => {
      const searchTerm = 'Error';
      service.searchRecipesByName(searchTerm).subscribe((recipes) => {
        // Expect an empty array on error due to handleError logic
        expect(recipes).toEqual([]);
      });

      const req = httpTestingController.expectOne(`${API_BASE_URL}/search.php?s=${searchTerm}`);
      // Simulate a 500 server error
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });

  // Describe block for the 'getRecipeById' method
  describe('getRecipeById', () => {
    it('should return a single recipe on success', () => {
      const mockRecipe: Recipe = { idMeal: '52772', strMeal: 'Teriyaki Chicken Casserole' } as Recipe;
      const recipeId = '52772';

      service.getRecipeById(recipeId).subscribe((recipe) => {
        expect(recipe).toBeTruthy();
        expect(recipe?.idMeal).toBe(recipeId);
      });

      const req = httpTestingController.expectOne(`${API_BASE_URL}/lookup.php?i=${recipeId}`);
      expect(req.request.method).toBe('GET');
      req.flush({ meals: [mockRecipe] });
    });

    it('should return null if no recipe is found', () => {
      const recipeId = 'invalid-id';
      service.getRecipeById(recipeId).subscribe((recipe) => {
        expect(recipe).toBeNull();
      });

      const req = httpTestingController.expectOne(`${API_BASE_URL}/lookup.php?i=${recipeId}`);
      // Simulate the API returning null for the meals array
      req.flush({ meals: null });
    });

    it('should handle API errors and return null', () => {
      const recipeId = 'error-id';
      service.getRecipeById(recipeId).subscribe((recipe) => {
        expect(recipe).toBeNull();
      });

      const req = httpTestingController.expectOne(`${API_BASE_URL}/lookup.php?i=${recipeId}`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  // Describe block for the 'getCategories' method
  describe('getCategories', () => {
    it('should return an array of categories on success', () => {
      const mockCategories: Category[] = [{ idCategory: '1', strCategory: 'Beef' } as Category];

      service.getCategories().subscribe((categories) => {
        expect(categories.length).toBe(1);
        expect(categories[0].strCategory).toBe('Beef');
      });

      const req = httpTestingController.expectOne(`${API_BASE_URL}/categories.php`);
      expect(req.request.method).toBe('GET');
      req.flush({ categories: mockCategories });
    });

    it('should handle API errors and return an empty array', () => {
      service.getCategories().subscribe(categories => {
        expect(categories).toEqual([]);
      });

      const req = httpTestingController.expectOne(`${API_BASE_URL}/categories.php`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  // Describe block for the 'filterByCategory' method
  describe('filterByCategory', () => {
    it('should return an array of recipes for a category', () => {
      const mockRecipes: Recipe[] = [{ idMeal: '1', strMeal: 'Beef Stew' } as Recipe];
      const categoryName = 'Beef';

      service.filterByCategory(categoryName).subscribe((recipes) => {
        expect(recipes.length).toBe(1);
        expect(recipes[0].strMeal).toBe('Beef Stew');
      });

      const req = httpTestingController.expectOne(`${API_BASE_URL}/filter.php?c=${categoryName}`);
      expect(req.request.method).toBe('GET');
      req.flush({ meals: mockRecipes });
    });

    it('should handle API errors and return an empty array', () => {
      const categoryName = 'ErrorCategory';
      service.filterByCategory(categoryName).subscribe(recipes => {
        expect(recipes).toEqual([]);
      });

      const req = httpTestingController.expectOne(`${API_BASE_URL}/filter.php?c=${categoryName}`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });
});
