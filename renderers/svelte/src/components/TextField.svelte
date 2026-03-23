<script lang="ts">
  import type { SurfaceModel, ComponentApi } from '@a2ui/web_core/v0_9';
  import type { ComponentRegistry, BoundProperty } from '../core/types.js';

  interface Props {
    props: Record<string, BoundProperty>;
    surface: SurfaceModel<ComponentApi>;
    componentId: string;
    dataContextPath: string;
    registry: ComponentRegistry;
  }

  let { props }: Props = $props();

  const label = $derived(props.label?.value ?? '');
  const value = $derived(props.value?.value ?? '');
  const variant = $derived(props.variant?.value ?? 'shortText');

  const inputType = $derived.by(() => {
    switch (variant) {
      case 'obscured':
        return 'password';
      case 'number':
        return 'number';
      default:
        return 'text';
    }
  });

  const isLongText = $derived(variant === 'longText');

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    props.value?.onUpdate(target.value);
  }
</script>

<div class="a2ui-text-field">
  {#if label}
    <label class="a2ui-text-field-label">{label}</label>
  {/if}
  {#if isLongText}
    <textarea
      class="a2ui-text-field-input"
      value={value}
      oninput={handleInput}
    ></textarea>
  {:else}
    <input
      class="a2ui-text-field-input"
      type={inputType}
      value={value}
      oninput={handleInput}
    />
  {/if}
</div>
