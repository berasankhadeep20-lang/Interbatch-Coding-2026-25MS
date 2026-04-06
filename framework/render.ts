/**
 * A lightweight hyperscript implementation for creating DOM trees declaratively.
 * Eliminates the need for multiple manual `document.createElement` and `el.appendChild` calls.
 *
 * @param tag The HTML tag name (e.g., 'div', 'button', 'a')
 * @param props Attributes, styles, and event listeners (e.g., { className: 'flex', onClick: () => {} })
 * @param children A list of nested elements or text content
 * @returns The cleanly constructed HTMLElement
 */
export function h<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    props?: Record<string, any> | null,
    ...children: (HTMLElement | string | number | null | undefined)[]
): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag);

    if (props) {
        for (const [key, value] of Object.entries(props)) {
            // Handle event listeners (e.g., onClick -> click)
            if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.toLowerCase().substring(2);
                el.addEventListener(eventName, value as EventListener);
            } 
            // Handle css classes
            else if (key === 'className' || key === 'class') {
                el.className = value;
            } 
            // Handle inline styles as objects
            else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } 
            // Handle generic attributes safely
            else if (value !== null && value !== undefined) {
                el.setAttribute(key, String(value));
            }
        }
    }

    // Append child nodes
    for (const child of children) {
        if (child === null || child === undefined) continue;
        
        if (typeof child === 'string' || typeof child === 'number') {
            el.appendChild(document.createTextNode(String(child)));
        } else if (child instanceof Node) {
            el.appendChild(child);
        }
    }

    return el;
}

/**
 * A utility to quickly parse a raw HTML string into an interactive DOM Element.
 * Useful for static heavy HTML chunks without event bindings.
 * 
 * @param htmlString The raw HTML string
 * @returns The first constructed root HTMLElement from the string
 */
export function html(htmlString: string): HTMLElement {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstElementChild as HTMLElement;
}
