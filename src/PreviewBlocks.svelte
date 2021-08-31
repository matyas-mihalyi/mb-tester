<script lang="ts">
  import { toRender } from './Input.svelte'
  
  type Block = {
    deviceName:string;
    screenRes:string;
    mbWidth:number;
    mbHeight:number;
  }
  
  const blocks:Block[] = [
    {
      deviceName: "iPhone 5/SE",
      screenRes: "320 x 568",
      mbWidth: 158,
      mbHeight: 316,
    },
    {
      deviceName: "Tall Phone",
      screenRes: "414 x 896",
      mbWidth: 205,
      mbHeight: 318.35,
    },
    {
      deviceName: "iPhone 6/7/8",
      screenRes: "414 x 896",
      mbWidth: 186,
      mbHeight: 318.5,
    },
    {
      deviceName: "iPad Portrait",
      screenRes: "768 x 1024",
      mbWidth: 382.5,
      mbHeight: 302.75,
    },
    {
      deviceName: "iPad Landscape",
      screenRes: "1024 x 768",
      mbWidth: 340,
      mbHeight: 382.75,
    },
    {
      deviceName: "Small Desktop",
      screenRes: "1366 x 768",
      mbWidth: 271.95,
      mbHeight: 338.75,
    },
    {
      deviceName: "Medium Desktop 1",
      screenRes: "1440 x 900",
      mbWidth: 286.75,
      mbHeight: 338.75,
    },
    {
      deviceName: "Medium Desktop 2",
      screenRes: "1536 x 864",
      mbWidth: 305.95,
      mbHeight: 338.75,
    },
    {
      deviceName: "Medium Desktop 3",
      screenRes: "1600 x 900",
      mbWidth: 318.75,
      mbHeight: 338.75,
    },
    {
      deviceName: "Large Desktop",
      screenRes: "1920 x 1080",
      mbWidth: 382.75,
      mbHeight: 338.75,
    },
  ];

</script>

{#if $toRender !== ""}

<ul class="block-list">
  {#each blocks as block}
    <li>
      <h3>{block.deviceName}</h3>
      <h4>Screen resolution: {block.screenRes}</h4>
      <div class="block-wrapper" style="width: {block.mbWidth}px; height: {block.mbHeight}px">
          {@html $toRender}
      </div>
    </li>
  {/each}
</ul>

{/if}

<style>

.block-wrapper {
  background-color: aquamarine;
}

ul {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

li {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3.2em 0;
}

h3 {
	font-size: 3.2rem;
}
h4 {
  font-size: 2.4rem;
  margin-bottom: 1.6rem;
  color: #666;
}

</style>
