import {
  MessageProcessor,
  type Catalog,
  type ComponentApi,
  type SurfaceGroupModel,
} from '@a2ui/web_core/v0_9';

/**
 * Options for creating an A2UI renderer instance.
 */
export interface A2UIOptions {
  /** The component catalogs defining available components and functions. */
  catalogs: Catalog<ComponentApi>[];
  /** Called when a component dispatches an action (receives A2uiClientAction). */
  onAction?: (action: any) => void;
}

/**
 * The return value of `createA2UI()` — provides the API for managing A2UI surfaces.
 */
export interface A2UIInstance {
  /** The surface group model containing all active surfaces. */
  readonly surfaceGroup: SurfaceGroupModel<ComponentApi>;
  /** Process one or more A2UI server messages (createSurface, updateComponents, etc.). */
  processMessages: (messages: any[]) => void;
  /** Remove all surfaces and reset state. */
  clearSurfaces: () => void;
  /** Tear down all subscriptions and models. Call on component unmount. */
  dispose: () => void;
}

/**
 * Creates an A2UI renderer instance for managing surfaces and processing messages.
 *
 * This is the main entry point for using A2UI in a Svelte application.
 * Call this in a component's `<script>` block, and use `$effect` for cleanup.
 *
 * @example
 * ```svelte
 * <script>
 *   import { createA2UI } from '@a2ui/svelte';
 *   import { createDefaultRegistry } from '@a2ui/svelte/components';
 *
 *   const a2ui = createA2UI({
 *     catalogs: [catalog],
 *     onAction: (action) => console.log('Action:', action),
 *   });
 *
 *   $effect(() => () => a2ui.dispose());
 * </script>
 *
 * <Surface surfaceGroup={a2ui.surfaceGroup} surfaceId="main" {registry} />
 * ```
 */
export function createA2UI(options: A2UIOptions): A2UIInstance {
  const processor = new MessageProcessor(options.catalogs);
  const surfaceGroup = processor.model;

  const actionUnsub = surfaceGroup.onAction.subscribe((event) => {
    options.onAction?.(event);
  });

  return {
    surfaceGroup,

    processMessages(messages: any[]) {
      processor.processMessages(messages);
    },

    clearSurfaces() {
      surfaceGroup.dispose();
    },

    dispose() {
      actionUnsub.unsubscribe();
      surfaceGroup.dispose();
    },
  };
}
