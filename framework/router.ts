/**
 * RouteHandler is a function that takes a context and returns an HTMLElement.
 *
 * @param context context for navigation and parameters
 * @returns {HTMLElement} The root element of the rendered component
 */
export type RouteHandler = (context: { navigate: (path: string) => void, params: Record<string, string> }) => HTMLElement;

/**
 * ComponentWithCleanup extends an HTMLElement to include an optional
 * `_cleanup` method that is invoked when the component is removed
 * from the DOM by the Router.
 */
export interface ComponentWithCleanup extends HTMLElement {
    _cleanup?: () => void;
}

interface Route {
    path: string; // e.g., '/blog/:slug'
    handler: RouteHandler;
}

/**
 * A Vanilla JS Router that handles client-side routing.
 * 
 * Supports exact matches, parameterized routes (e.g. `/user/:id`), and catch-all routes (`*`).
 */
export class Router {
    private routes: Route[] = [];
    private root: HTMLElement;
    private currentCleanup: (() => void) | null = null;

    /**
     * @param rootId The HTML ID of the root container element.
     */
    constructor(rootId: string) {
        const el = document.getElementById(rootId);
        if (!el) throw new Error(`Root element #${rootId} not found`);
        this.root = el;

        // Listen for browser forward/back buttons
        window.addEventListener('popstate', () => this.resolve());

        // Intercept clicks on local anchor tags to use pushState
        document.addEventListener('click', (e) => {
            const target = (e.target as HTMLElement).closest('a');
            if (target && target.href.startsWith(window.location.origin) && !target.hasAttribute('download') && target.target !== '_blank') {
                e.preventDefault();
                this.navigate(target.getAttribute('href')!);
            }
        });
    }

    /**
     * Register a new route.
     * @param path Path template (e.g., '/home', '/post/:id', or '*')
     * @param handler Function returning the component to render
     */
    add(path: string, handler: RouteHandler) {
        this.routes.push({ path, handler });
    }

    /**
     * Programmatically navigate to a different path
     * @param path The URL path to navigate to
     */
    navigate(path: string) {
        window.history.pushState(null, '', path);
        this.resolve();
    }

    /**
     * Finds a matching route for the given URL path
     * @param urlPath The current URL pathname
     */
    private match(urlPath: string): { handler: RouteHandler, params: Record<string, string> } | null {
        for (const route of this.routes) {
            const routeParts = route.path.split('/').filter(Boolean);
            const urlParts = urlPath.split('/').filter(Boolean);

            if (routeParts.length !== urlParts.length && route.path !== '*') continue;
            
            // Handle catch-all routes
            if (route.path === '*') return { handler: route.handler, params: {} };

            const params: Record<string, string> = {};
            let match = true;

            for (let i = 0; i < routeParts.length; i++) {
                if (routeParts[i].startsWith(':')) {
                    params[routeParts[i].substring(1)] = urlParts[i];
                } else if (routeParts[i] !== urlParts[i]) {
                    match = false;
                    break;
                }
            }

            if (match) return { handler: route.handler, params };
        }
        return null; // Fallback handled in resolve
    }

    /**
     * Resolves the current URL path against registered routes
     * and mounts the corresponding component in the root element.
     */
    resolve() {
        const path = window.location.pathname;

        // Clean up previous page component if applicable
        if (this.currentCleanup) {
            this.currentCleanup();
            this.currentCleanup = null;
        }
        this.root.innerHTML = '';

        const match = this.match(path);
        if (match) {
            const component = match.handler({ navigate: (p) => this.navigate(p), params: match.params });
            this.root.appendChild(component);
            
            // Attach cleanup function if the component has one
            const componentWithCleanup = component as ComponentWithCleanup;
            if (componentWithCleanup._cleanup) {
                this.currentCleanup = componentWithCleanup._cleanup;
            }
        } else {
            // Fallback to strict match or 404 (handled by caller typically adding a catch-all)
            const catchAll = this.routes.find(r => r.path === '*');
            if (catchAll) {
                const component = catchAll.handler({ navigate: (p) => this.navigate(p), params: {} });
                this.root.appendChild(component);
            } else {
                this.root.innerHTML = '<h1>404 - Not Found</h1>';
            }
        }

        // Scroll to top on new navigation
        window.scrollTo(0, 0);
    }
}
