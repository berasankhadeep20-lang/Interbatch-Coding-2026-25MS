export interface RouteContext {
    navigate: (path: string) => void;
    params: Record<string, string>;
}

export type ComponentRenderer = (context: RouteContext) => HTMLElement;

/**
 * A helper to define a reusable vanilla JS Component.
 * 
 * It wraps the generic ComponentWithCleanup pattern into a simpler API.
 * 
 * @param render A function returning the DOM elements of the component configuration
 * @param cleanup An optional cleanup function to execute when removing the component
 */
export function createComponent(render: ComponentRenderer, cleanup?: () => void): ComponentRenderer {
    return (context: RouteContext) => {
        const el = render(context);
        
        // Attach cleanup hook so the Router can dismantle event listeners when navigating away
        if (cleanup) {
            (el as any)._cleanup = cleanup;
        }
        
        return el;
    };
}

/**
 * Utility to mount a component directly to a specified DOM element
 * @param root The root element to mount to
 * @param component The ComponentRenderer output to append
 */
export function mountComponent(root: HTMLElement, component: HTMLElement) {
    if ((root as any)._currentCleanup) {
        (root as any)._currentCleanup();
    }
    
    root.innerHTML = '';
    root.appendChild(component);
    
    // Track cleanup hook for subsequent mounts
    if ((component as any)._cleanup) {
        (root as any)._currentCleanup = (component as any)._cleanup;
    }
}
