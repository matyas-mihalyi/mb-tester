<script context="module" lang="ts">
  import { writable } from 'svelte/store';
  export const toRender = writable("");
</script>

<script lang="ts">
  let inputValue = ``;

  function render () {
    toRender.set(`${inputValue}`);
  };
</script>
<div class="input-wrapper">
  <label for="mbcode">Insert code below</label>
  <input id="mbcode" type="text" bind:value={inputValue}>
  <button class="vtmn-btn" on:click="{()=> render()}">Render</button>
</div>

<style>
  .input-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .input-wrapper > * {
    margin: 0.8rem 0;
  }

  label, input {
    font-size: 1.6rem;
    font-family: 'Roboto', 'system-ui', '-apple-system', sans-serif;
  }

  .vtmn-btn {
  box-shadow: inset 0 0 0 0.200rem transparent;
  font-size: 1.600rem;
  min-height: 4.800rem;
  max-width: 100%;
  padding: 1.400rem 2.400rem;
  line-height: 1.25;
  letter-spacing: 0.050rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: #007dbc;
  border-radius: 0.400rem;
  border-width: 0;
  box-sizing: border-box;
  display: inline-block;
  font-family: 'Roboto', 'system-ui', '-apple-system', sans-serif;
  font-weight: 700;
  position: relative;
  text-align: center;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
}
</style>