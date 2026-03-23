<script lang="ts">
  import type { SurfaceModel, ComponentApi } from '@a2ui/web_core/v0_9';
  import type { ComponentRegistry, BoundProperty } from './types.js';
  import { bindComponentProps } from './use-component.svelte.js';

  interface Props {
    /** The SurfaceModel containing component and data state. */
    surface: SurfaceModel<ComponentApi>;
    /** The component ID to render (defaults to 'root'). */
    componentId?: string;
    /** The data context path scope (defaults to '/'). */
    dataContextPath?: string;
    /** The component registry mapping type names to Svelte components. */
    registry: ComponentRegistry;
  }

  let {
    surface,
    componentId = 'root',
    dataContextPath = '/',
    registry,
  }: Props = $props();

  // Look up the component model from the surface
  const componentModel = $derived(surface.componentsModel.get(componentId));
  const componentType = $derived(componentModel?.type);

  // Look up the Svelte component from the registry
  const Component = $derived(componentType ? registry.get(componentType) : undefined);

  // Bind all props to reactive Svelte values
  const boundProps = $derived(
    componentModel ? bindComponentProps(surface, componentId, dataContextPath) : {}
  );
</script>

{#if Component}
  <svelte:component
    this={Component}
    props={boundProps}
    {surface}
    {componentId}
    {dataContextPath}
    {registry}
  />
{:else if componentType}
  <div data-a2ui-unknown={componentType}>Unknown component: {componentType}</div>
{/if}
