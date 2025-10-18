import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex flex-col min-h-screen bg-gray-50 font-sans">

      <!-- Header -->
      <header class="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
        <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
          <!-- Brand/Logo -->
          <a routerLink="/" class="text-2xl font-bold hover:text-orange-400 transition-colors">
            Recipe Platform
          </a>

          <!-- Navigation Links -->
          <ul class="flex items-center space-x-6">
            <li>
              <a
                routerLink="/"
                routerLinkActive="text-orange-400 border-b-2 border-orange-400"
                [routerLinkActiveOptions]="{ exact: true }"
                class="py-2 hover:text-orange-400 transition-colors"
                >Home</a
              >
            </li>
            <li>
              <a
                routerLink="/recipes"
                routerLinkActive="text-orange-400 border-b-2 border-orange-400"
                class="py-2 hover:text-orange-400 transition-colors"
                >Find Recipes</a
              >
            </li>
          </ul>
        </nav>
      </header>

      <!-- Main Content Area -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-gray-800 text-gray-300 py-4 mt-auto">
        <div class="container mx-auto text-center text-sm">
          <p>&copy; {{ currentYear }} Recipe Platform. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  `,
})

export class AppComponent {
  title = 'recipe-platform';
  currentYear = new Date().getFullYear();
}