<script>
  const profileImgSrc = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80';
</script>

<svelte:head>
	<title>Name | Role</title>
</svelte:head>

<div>
  <div class="header">
    <picture class="profileImg">
      <img src={profileImgSrc} alt="">
    </picture>
    <div class="info">
      <h1 class="name">Lukas Köller</h1>
      <div class="role">React Frontend Developer</div>
      <button>Schedule</button>
    </div>
  </div>
</div>

<style>
  .header {
    display: flex;
    gap: var(--size-4);
    padding: var(--size-3);
  }

  .profileImg {
    inline-size: var(--size-11);
    aspect-ratio: var(--ratio-box);
    overflow: hidden;
    border-radius: var(--radius-round);

    & > img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }
  }

  .name {
    font-size: var(--font-size-4);
    font-weight: var(--font-weight-5);
    color: var(--primary-color-base);
  }

  .role {
    color: var(--primary-color-2);
  }
</style>