# The Vanilla JS Framework

This folder extracts some core abstractions into reusable "framework" concepts, completely based on Vanilla JavaScript. It requires no build step to conceptually work, though this extraction uses TypeScript to formalize the types.

## Core Parts

### 1. `router.ts` (Routing Layer)
A lightweight Single Page Application (SPA) router handling client-side navigation via the History API.
- **`Router` class**: Maps URL paths to Component Renderers.
- **Route Parameters**: Supports dynamic routing (e.g., `/user/:id`).
- **Catch-all**: The `*` route acts as a 404 fallback.
- **Cleanup Handlers**: Automatically triggers the `_cleanup()` method attached to disappearing components, heavily reducing memory leaks.

**Usage:**
```typescript
import { Router } from './router';

const app = new Router('root-element-id');
app.add('/', () => {
    const el = document.createElement('div');
    el.textContent = 'Home Page';
    return el;
});
app.resolve();
```

### 2. `store.ts` (State Management)
Abstracts the observer / publish-subscribe system used heavily by `ThemeStore` and `AuthStore` into a generic, reusable generic Class.
- **`Store<T>`**: Manages any initial state type.
- **Updates**: Provide either a raw value or an updater function (e.g., `prev => next`).
- **Reactivity**: Subscribing returns an unsubscription function, cleanly enabling lifecycle dismounts.

**Usage:**
```typescript
import { Store } from './store';

const counter = new Store<number>(0);
const unsubscribe = counter.subscribe((count) => console.log('Count is:', count));

counter.set(c => c + 1); // Notifies subscribers
unsubscribe(); // Clean up listeners
```

### 3. `component.ts` (Component Definitions)
Consolidates the `ComponentWithCleanup` pattern into an easier-to-author utility that ensures returning HTML Elements appropriately tracks `_cleanup` functions.
- **`createComponent()`**: A factory enabling strict segregation between the DOM mounting implementation and the tear-down execution hook.

**Usage:**
```typescript
import { createComponent } from './component';

export const MyButtonPage = createComponent((context) => {
    const btn = document.createElement('button');
    btn.textContent = 'Click me';

    const handler = () => context.navigate('/success');
    btn.addEventListener('click', handler);

    return btn;
}, () => {
    // Optional Cleanup Method - Router removes listener automatically
    console.log("Unmounted button, cleaning up...");
});
```

### 4. `render.ts` (Declarative View Layer)
Replaces repetitive imperative DOM manipulation (`document.createElement`, `el.className=`, `el.appendChild`) with a declarative, nested function API heavily inspired by Hyperscript/React.
- **`h(tag, props, ...children)`**: Builds DOM trees dynamically while seamlessly attaching inline event listeners (like `onClick`) and properties.
- **`html(string)`**: Parses raw HTML strings directly into DOM elements for completely static UI chunks.

**Usage:**
```typescript
import { h, html } from './render';

// Instead of 10 lines of document.createElement and setAttribute:
const navLinks = h('nav', { className: 'flex gap-4 p-4 bg-gray-100' },
    h('a', { href: '/', onClick: (e) => navigate(e) }, 'Home'),
    h('button', { 
        className: 'bg-blue-500 text-white p-2', 
        onClick: () => store.set('loggedIn') 
    }, 'Login')
);

// For static HTML chunks:
const icon = html(`<svg class="w-6 h-6"><path d="..."/></svg>`);
navLinks.appendChild(icon);
```
