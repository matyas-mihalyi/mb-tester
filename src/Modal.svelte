<script context="module" lang="ts">
  const modals = {};
  
  export function getModal(id:string) {return modals[id]}
</script>


<script lang="ts">
  import { onDestroy } from 'svelte';
  let visible:boolean = false;
  export let id: string;
  
  function open () {
    visible = true;
  };
  function close () {
    visible = false;
  };
  modals[id] = {open, close};
  onDestroy(()=> delete(modals[id]));
</script>

{#if visible}
<div class="modal">
  <div class="modal-content">
    <slot></slot>
  </div>  
</div>
{/if}

<style>
  .modal {
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #4448;
		display: flex;
		align-items: center;
		justify-content: center;
	}
  
  .modal-content {
		position: relative;
    width: 20vw;
    font-size: 3.2rem;
		border-radius: 8px;
		background: #fff;
		padding: 1.625em;
    display: flex;
    flex-direction: column;
  }
 
</style>