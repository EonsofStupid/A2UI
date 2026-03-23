import type { Component as SvelteComponent } from 'svelte';
import type { ComponentApi } from '@a2ui/web_core/v0_9';

/**
 * A component property bound to a reactive Svelte value with an update callback.
 *
 * Components receive a `Record<string, BoundProperty>` as their `props` prop.
 * Use `prop.value` to read the current value (reactive via Svelte 5 runes).
 * Call `prop.onUpdate(newValue)` for two-way binding (e.g., text field input).
 */
export interface BoundProperty<T = any> {
  /** The current resolved value. Reactive — will trigger re-renders when changed. */
  readonly value: T;
  /** The raw value from the A2UI component model (may be a literal or a data binding). */
  readonly raw: any;
  /** Callback to push a new value back to the A2UI data model. No-op for non-bound values. */
  readonly onUpdate: (newValue: T) => void;
}

/**
 * A catalog entry mapping a component type name to a Svelte component.
 */
export interface ComponentEntry {
  /** The A2UI component type name (e.g., 'Button', 'Text'). */
  name: string;
  /** The A2UI schema API definition for this component. */
  api: ComponentApi;
  /** The Svelte component to render for this type. */
  component: SvelteComponent<any>;
}

/**
 * A registry mapping component type names to Svelte components.
 * Users can override any entry to swap in their own design system components.
 */
export type ComponentRegistry = Map<string, SvelteComponent<any>>;
