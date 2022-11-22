<script lang="ts">
	import Container from "$lib/container/Container.svelte";
	import { Size } from "types";

  export let heading: string;
</script>

<Container>
  <Container size={Size.Xs}>
    <div class="fd-stack custom">
      <h1>{heading}</h1>
      <div>
        <div>
          <slot></slot>
        </div>
        <div class="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Container>
</Container>

<style lang="postcss">
  .fd-stack {
    gap: var(--size-fluid-5);
  }

  .footer {
    inline-size: 100%;
    border-start-start-radius: var(--radius-3);
    border-start-end-radius: var(--radius-3);
    position: sticky;
    bottom: 0;
    /* padding-inline: var(--global-spacing); */
		padding-block: calc(var(--global-spacing) / 2);

    backdrop-filter: blur(16px);
  }
</style>