<script context="module" lang="ts">
  import {_render} from './templates'
  export type Input = {
    title:string,
    buttontext:string,
    picture:string,
    href:string,
    type:string,
    eventlabel:string,
    newtab:boolean
  };
</script>

<script lang="ts">
import Modal,{getModal} from './Modal.svelte';
import {toRender, toCopy, element, input} from './stores'

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


</script>

<div class="input-wrapper">
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
    {#if $input[$element][inputFields[i]].type === 'select'}
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
</div>



<style>
  .input-wrapper{
    display: flex;
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
  }

  input[type="checkbox"]{
    transform: scale(1.5) translatex(25%) translatey(25%);
  }

  .button-wrapper {
    margin-top: 3.2em;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    column-gap: 1.6rem;
  }

  .clearbtn {
    margin-left: 0.8rem;
    cursor: pointer;
  }
  .clearbtn:hover {
    color:red;
  }

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
</style>