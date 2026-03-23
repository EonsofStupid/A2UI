import {
  ComponentContext,
  DataContext,
  effect,
  type Signal as PreactSignal,
} from '@a2ui/web_core/v0_9';
import type { SurfaceModel, ComponentApi } from '@a2ui/web_core/v0_9';
import type { BoundProperty } from './types.js';

/**
 * Binds all properties of an A2UI component to Svelte 5 reactive values.
 *
 * Follows the same pattern as Angular v0.9's ComponentBinder:
 * 1. Iterates over each raw property in the component model
 * 2. Resolves each via `DataContext.resolveSignal()` to get a Preact Signal
 * 3. Bridges each Signal to a Svelte `$state` reactive value
 * 4. Provides `onUpdate` callbacks for two-way binding
 *
 * @param surface The SurfaceModel this component belongs to.
 * @param componentId The unique ID of the component.
 * @param dataContextPath The data context scope path (default '/').
 * @returns A reactive record of bound properties.
 */
export function bindComponentProps(
  surface: SurfaceModel<ComponentApi>,
  componentId: string,
  dataContextPath: string = '/',
): Record<string, BoundProperty> {
  const context = new ComponentContext(surface, componentId, dataContextPath);
  const props = context.componentModel.properties;
  const bound: Record<string, BoundProperty> = {};

  for (const key of Object.keys(props)) {
    const rawValue = props[key];
    const preactSignal: PreactSignal<any> = context.dataContext.resolveSignal(rawValue);

    // Create reactive Svelte state from the Preact Signal
    let current = $state<any>(preactSignal.peek());

    $effect(() => {
      const dispose = effect(() => {
        current = preactSignal.value;
      });

      return () => {
        dispose();
        if ((preactSignal as any).unsubscribe) {
          (preactSignal as any).unsubscribe();
        }
      };
    });

    const isBoundPath = rawValue && typeof rawValue === 'object' && 'path' in rawValue;

    bound[key] = {
      get value() {
        return current;
      },
      raw: rawValue,
      onUpdate: isBoundPath
        ? (newValue: any) => context.dataContext.set(rawValue.path, newValue)
        : () => {},
    };
  }

  return bound;
}

/**
 * Resolves an action from a bound property and dispatches it on the surface.
 *
 * @param surface The SurfaceModel to dispatch on.
 * @param action The raw action value from bound props.
 * @param componentId The source component ID.
 * @param dataContextPath The current data context path.
 */
export function dispatchAction(
  surface: SurfaceModel<ComponentApi>,
  action: any,
  componentId: string,
  dataContextPath: string = '/',
): void {
  if (!action) return;
  const dataContext = new DataContext(surface, dataContextPath);
  const resolved = dataContext.resolveAction(action);
  surface.dispatchAction(resolved, componentId);
}
