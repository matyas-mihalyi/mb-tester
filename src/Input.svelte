<script context="module" lang="ts">
  import { writable } from 'svelte/store';
  export const toRender = writable("");
</script>

<script lang="ts">
<<<<<<< Updated upstream
  let inputValue = ``;

  function render () {
    toRender.set(`${inputValue}`);
  };
=======
import Modal,{getModal} from './Modal.svelte';
import {toRender, toCopy, element, input, SelectParam, TextInputParam, CheckboxParam} from './stores'

  $: inputFields = Object.keys($input[$element]);
  
  function render () {
    toRender.set(_render($input[$element], true));
    toCopy.set(_render($input[$element], false));
  };
  $:{
    render();
  };

  //HELPERS

  function copyToClipboard () {
    navigator.clipboard.writeText($toCopy);
  };

  function resetInput () {
    Object.keys($input[$element]).map(e => {
      const type = typeof $input[$element][e].value;
      if ($input[$element][e].value === "") {
        return
      } else if ($input[$element][e].type === "select") {
        $input[$element][e].value = $input[$element][e].options[0].value;
      } else if (type === "string") {
        $input[$element][e].value = "";
      } else if (type === "boolean") {
        $input[$element][e].value = false;
      }
    });
    render();
  };

  //disable copy if not everything is filled
  let isDisabled = true;
  $:$input[$element], isDisabled = (Object.keys($input[$element]).filter(e => $input[$element][e].value === "").length) > 0;
  

  function clearInput (field) {
    $input[$element][field].value = ""
  };

  let timer;
  const debounce = (value, input) => {
    clearTimeout(timer);
		timer = setTimeout(() => {
			value.value = input;
      render()
		}, 750);
  };

  function handlePaste (e, value) {
    const text = e.clipboardData.getData('text');
    value.value = text;
    render();
  };

  function copyAlert () {
    getModal("alert").open();
    setTimeout(()=> {
      getModal("alert").close();
    }, 700)
  };

  //input types

>>>>>>> Stashed changes
</script>
<div class="input-wrapper">
<<<<<<< Updated upstream
  <label for="mbcode">Insert code below</label>
  <input id="mbcode" type="text" bind:value={inputValue}>
  <button class="vtmn-btn" on:click="{()=> render()}">Render</button>
=======
  <label for="type">
    Element type
  </label>
  <select id="type" name="type" bind:value={$element} on:change="{()=>{resetInput(); render(); }}">
    <option value="mainpromo">Main promo</option>
    <option value="secondarypromo">Secondary promo</option>
    <option value="marketingblock">Marketingblock</option>
  </select>

  {#each inputFields as field,i}
    <label for={inputFields[i]}>
      {$input[$element][inputFields[i]].name}
    </label>

    <!-- select -->
    {#if $input[$element][inputFields[i]].type === 'select' && $input[$element][inputFields[i]]}

      <select id={inputFields[i]} name="type" bind:value={$input[$element][inputFields[i]].value} on:change="{render}">
        {#each $input[$element][inputFields[i]].options as {name, value}}
          <option value={value}>{name}</option>
        {/each}
      </select>

    <!-- checkbox -->
    {:else if $input[$element][inputFields[i]].type === 'input' && $input[$element][inputFields[i]].inputType === 'checkbox'}
    <!-- svelte-ignore component-name-lowercase -->
    <input type="checkbox" id={inputFields[i]} bind:checked={$input[$element][inputFields[i]].value}>
    
    <!-- text input -->
    {:else}
    <!-- svelte-ignore component-name-lowercase -->
    <input id={inputFields[i]} 
      on:keyup={( {currentTarget: {value}})=>debounce($input[$element][inputFields[i]], value)} 
      on:paste={(e) => handlePaste(e, $input[$element][inputFields[i]])}
      bind:value={$input[$element][inputFields[i]].value}
      >

    <span class="material-icons clearbtn"  on:click="{()=>clearInput(field)}">
      clear
    </span>
    {/if}
  
  {/each}



  <div class="button-wrapper">

    <button class="vtmn-btn vtmn-btn_variant--secondary" on:click="{()=> resetInput()}">
      Reset
    </button>

    <button class="vtmn-btn vtmn-btn_variant--primary" 
      on:click="{()=> {copyToClipboard(); copyAlert()} }" 
      disabled="{isDisabled}"
    >      
      Copy code
    </button>
  </div>

  <Modal id="alert">
    <span>Code copied</span> 
  </Modal>
>>>>>>> Stashed changes
</div>

<style>
  .input-wrapper{
    display: flex;
<<<<<<< Updated upstream
    flex-direction: column;
    align-items: center;
  }

  .input-wrapper > * {
    margin: 0.8rem 0;
=======
    flex-wrap: wrap;
    justify-content: flex-start;
    grid-column: 1/2;
    padding: 3.2em;
    border-radius: 1.6rem;
    box-shadow: inset 0 0 0 0.200rem #001018;

  }
  
  label, input:not([type="checkbox"]) {
    width: 80%;
    font-family: 'Roboto', 'system-ui', '-apple-system', sans-serif;
  }

  label {
    margin-bottom: 0.4rem;
    font-size: 1.6rem;
  }
  
  
  input, select {
    font-size: 1.4rem;
    padding: 0.4rem;
    margin-bottom: 1.6rem !important;
  }
  select {
    width: 80%
>>>>>>> Stashed changes
  }

  label, input {
    font-size: 1.6rem;
    font-family: 'Roboto', 'system-ui', '-apple-system', sans-serif;
  }

<<<<<<< Updated upstream
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
=======
  label[for="type"] {
    font-size: 1.8rem;
    font-weight: 700;
    text-align: center;
    width: 100%;
  }
  #type {
    border: 4px solid hsl(200, 100%, 36.9%);
    padding: 0.8rem;
    border-radius: 3px;
    width: 100%;
    font-size: 1.8rem;
  }
>>>>>>> Stashed changes
</style>