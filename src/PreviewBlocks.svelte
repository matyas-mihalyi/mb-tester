

<script lang="ts">
  import {toRender, element} from './stores';
  
  import {blocks, Block} from './blocks';

  //check for previewblock's device width and force class accordingly
  //this is needed to see previews as if the mediaqueries in css were active
  function forceQueryClasses (block:Block) {
      const res = block.screenRes;
      const width = new Number(res.replace(/^(\d+).*/, "$1"));
      if (width < 600) {
        return "force-mobile force-tablet force-small force-medium"
      }
      else if (width < 900) {
        return "force-tablet force-small force-medium"
      }
      else if (width < 1200) {
        return "force-small force-medium"
      }
      else if (width < 1800) {
        return "force-medium"
      }
  };
  
</script>

{#if $toRender !== ""}

<ul class="block-list">
  {#each blocks as block}
    <li>
      <h3>{block.deviceName}</h3>
      <h4>Screen resolution: {block.screenRes}</h4>
      <!-- MARKETINGBLOCK -->
      {#if $element === "marketingblock"}
      <div class="block-wrapper {forceQueryClasses(block)}" style="width: {block[$element].width}px; height: {block[$element].height}px">
        {@html $toRender}
      </div>
      
      <!-- MAIN PROMO -->
      {:else if $element === "mainpromo"}
      <div class="promo-wrapper {forceQueryClasses(block)}">
        <div class="promo-container">
          <div class="promo-block" style="width: {block[$element].width}px; height: {block[$element].height}px">
            {@html $toRender}
          </div>
        </div>
      </div>
      
      <!-- SECONDARY PROMO -->
      {:else if $element === "secondarypromo"}
      <div class="blocks-container {forceQueryClasses(block)}" style="width: {block[$element].width}px; height: {block[$element].height}px">
        <div class="block" style="width: {block[$element].width}px; height: {block[$element].height}px">
            {@html $toRender}
        </div>
      </div>
      {/if}
    </li>
  {/each}
</ul>

{/if}

<style>

ul {
  grid-column: 2/5;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
  padding: 64px;
}

li {
  display: flex;
  flex-direction: column;
  align-items: center;
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
