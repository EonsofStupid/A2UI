import { effect, type Signal as PreactSignal } from '@a2ui/web_core/v0_9';

/**
 * Bridges a Preact Signal (from @a2ui/web_core) to a Svelte 5 reactive value.
 *
 * Uses `$state` to create a reactive variable that tracks the Preact Signal's value,
 * and `$effect` for automatic cleanup when the Svelte component is destroyed.
 *
 * @param preactSignal The source Preact Signal from web_core's DataContext.
 * @returns An object with a reactive `value` getter.
 *
 * @example
 * ```svelte
 * <script>
 *   import { fromSignal } from '@a2ui/svelte';
 *   const text = fromSignal(preactTextSignal);
 * </script>
 * <p>{text.value}</p>
 * ```
 */
export function fromSignal<T>(preactSignal: PreactSignal<T>): { readonly value: T } {
  let current = $state<T>(preactSignal.peek());

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

  return {
    get value() {
      return current;
    },
  };
}
