/**
 * A generalized subscription-based State Management Store.
 * This pattern abstracts the core reactivity model based on the ThemeStore/AuthStore implementations.
 */
export class Store<T> {
    private state: T;
    private listeners: Set<(state: T) => void> = new Set();

    /**
     * Create a new Store with an initial state
     * @param initialState The default starting state
     */
    constructor(initialState: T) {
        this.state = initialState;
    }

    /**
     * Get the current state synchronously
     */
    get(): T {
        return this.state;
    }

    /**
     * Update the state, either directly or via a callback that receives the current state.
     * Notifies all subscribers immediately after updating.
     * @param nextState New state or an updater function
     */
    set(nextState: T | ((curr: T) => T)) {
        if (typeof nextState === 'function') {
            // @ts-ignore
            this.state = nextState(this.state);
        } else {
            this.state = nextState;
        }
        this.notify();
    }

    /**
     * Subscribe to state changes. The listener is called immediately with the current state.
     * @param listener Callback function invoked on every state change
     * @returns An unsubscribe function to clean up the listener
     */
    subscribe(listener: (state: T) => void): () => void {
        this.listeners.add(listener);
        
        // Immediately notify the new subscriber with the latest state
        listener(this.state);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Broadcasts the current state to all subscribers.
     */
    private notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
}
