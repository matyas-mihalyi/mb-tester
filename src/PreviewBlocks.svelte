<script lang="ts">
import {toRender, element} from './stores'

  // type Dimensions = 'marketingblock' | 'mainpromo' | 'secondarypromo'
  type Dimensions = {width:number, height:number}
  
  type Block = {
    deviceName:string;
    screenRes:string;
    mainpromo:Dimensions;
    secondarypromo:Dimensions;
    marketingblock:Dimensions;
  };
  
  const blocks:Block[] = [
    {
      deviceName: "iPhone 5/SE",
      screenRes: "320 x 568",
      mainpromo: {
        width: 272,
        height: 245,
      },
      secondarypromo: {
        width: 272,
        height: 130,
      },
      marketingblock: {
        width: 158,
        height: 316,
      },
    },
    {
      deviceName: "Phone 1",
      screenRes: "360 x 640",
      mainpromo: {
        width: 312,
        height: 245,
      },
      secondarypromo: {
        width: 312,
        height: 130,
      },
      marketingblock: {
        width: 178.5,
        height: 348.3,
      }
    },
    {
      deviceName: "iPhone 6/7/8",
      screenRes: "414 x 896",
      mainpromo: {
        width: 327,
        height: 245,
      },
      secondarypromo: {
        width: 327,
        height: 130,
      },
      marketingblock: {
        width: 186,
        height: 318.5,
      }
    },
    {
      deviceName: "iPad Portrait",
      screenRes: "768 x 1024",
      mainpromo: {
        width: 720,
        height: 245,
      },
      secondarypromo: {
        width: 720,
        height: 130,
      },
      marketingblock: {
        width: 382.5,
        height: 302.75,
      }
    },
    {
      deviceName: "iPad Landscape",
      screenRes: "1024 x 768",
      mainpromo: {
        width: 832,
        height: 600,
      },
      secondarypromo: {
        width: 196,
        height: 250,
      },
      marketingblock: {
        width: 340,
        height: 382.75,
      }
    },
    {
      deviceName: "Small Desktop",
      screenRes: "1366 x 768",
      mainpromo: {
        width: 603,
        height: 600,
      },
      secondarypromo: {
        width: 293.5,
        height: 250,
      },
      marketingblock: {
        width: 271.95,
        height: 338.75,
      }
    },
    {
      deviceName: "Medium Desktop 1",
      screenRes: "1440 x 900",
      mainpromo: {
        width: 640,
        height: 600,
      },
      secondarypromo: {
        width: 312,
        height: 250,
      },
      marketingblock: {
        width: 286.75,
        height: 338.75,
      }
    },
    {
      deviceName: "Medium Desktop 2",
      screenRes: "1536 x 864",
      mainpromo: {
        width: 688,
        height: 600,
      },
      secondarypromo: {
        width: 336,
        height: 250,
      },
      marketingblock: {
        width: 305.95,
        height: 338.75,
      }
    },
    {
      deviceName: "Medium Desktop 3",
      screenRes: "1600 x 900",
      mainpromo: {
        width: 720,
        height: 600,
      },
      secondarypromo: {
        width: 352,
        height: 250,
      },
      marketingblock: {
        width: 318.75,
        height: 338.75,
      }
    },
    {
      deviceName: "Large Desktop",
      screenRes: "1920 x 1080",
      mainpromo: {
        width: 792,
        height: 600,
      },
      secondarypromo: {
        width: 388,
        height: 250,
      },
      marketingblock: {
        width: 382.75,
        height: 338.75,
      }
    },
  ];

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
  }
  
</script>

{#if $toRender !== ""}

<ul class="block-list">
  {#each blocks as block}
    <li>
      <h3>{block.deviceName}</h3>
      <h4>Screen resolution: {block.screenRes}</h4>
      {#if $element === "marketingblock"}
      <div class="block-wrapper ${forceQueryClasses(block)}" style="width: {block[$element].width}px; height: {block[$element].height}px">
        {@html $toRender}
      </div>

      {:else if $element === "mainpromo"}
      <div class="promo-wrapper {forceQueryClasses(block)}">
        <div class="promo-container">
          <div class="promo-block" style="width: {block[$element].width}px; height: {block[$element].height}px">
              {@html $toRender}
          </div>
        </div>
      </div>

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
