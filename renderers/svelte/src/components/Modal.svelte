<script lang="ts">
  import type { SurfaceModel, ComponentApi } from '@a2ui/web_core/v0_9';
  import type { ComponentRegistry, BoundProperty } from '../core/types.js';
  import ComponentHost from '../core/ComponentHost.svelte';

  interface Props {
    props: Record<string, BoundProperty>;
    surface: SurfaceModel<ComponentApi>;
    componentId: string;
    dataContextPath: string;
    registry: ComponentRegistry;
  }

  let { props, surface, dataContextPath, registry }: Props = $props();

  const trigger = $derived(props.trigger?.value);
  const content = $derived(props.content?.value);

  let isOpen = $state(false);

  function openModal() {
    isOpen = true;
  }

  function closeModal() {
    isOpen = false;
  }

  function onOverlayClick() {
    closeModal();
  }

  function onContentClick(event: MouseEvent) {
    event.stopPropagation();
  }
</script>

<div class="a2ui-modal-wrapper">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="a2ui-modal-trigger" onclick={openModal}>
    {#if trigger}
      <ComponentHost
        {surface}
        componentId={trigger}
        {dataContextPath}
        {registry}
      />
    {/if}
  </div>

  {#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="a2ui-modal-overlay" onclick={onOverlayClick}>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="a2ui-modal-content" onclick={onContentClick}>
        <button class="a2ui-modal-close" onclick={closeModal}>&times;</button>
        {#if content}
          <ComponentHost
            {surface}
            componentId={content}
            {dataContextPath}
            {registry}
          />
        {/if}
      </div>
    </div>
  {/if}
</div>
