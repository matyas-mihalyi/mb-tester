<script context="module" lang="ts">
  import { renderElement } from './templates'
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
import {toRender, toCopy, element, input, TextInput, CheckboxInput, SelectInput} from './stores'

  //set stores" content to the html content with
  function render () {
    toRender.set(renderElement($input[$element], true));
    toCopy.set(renderElement($input[$element], false));
    console.log($toRender)
    console.log($toCopy)
  };

  //render any time the stores are updated
  $:{
    render();
  };

  //copy html code to clipboard
  function copyToClipboard () {
    navigator.clipboard.writeText($toCopy);
  };

  //clear or set value to default for all input types
  function resetInput () {
    Object.keys($input[$element]).map(key => {
      
      const type = $input[$element][key].type;

      if ($input[$element][key].value === "") {
        return
      } else if (type === "input") {
        $input[$element][key].value = "";
      } else if (type === "checkbox") {
        $input[$element][key].value = false;
      }
    });
    render();
  };

  //clear a specific text input field
  function clearInput (key:string) {
    $input[$element][key].value = "";
    render();
  };

  //disable copy if not everything is filled
  let isDisabled = true;
  $:$input[$element], isDisabled = (Object.keys($input[$element]).filter(e => $input[$element][e].value === "").length) > 0;
  
  //debouncer
  let timer:null|ReturnType<typeof setTimeout>;
  const debounce = (value, input) => {
    clearTimeout(timer);
		timer = setTimeout(() => {
			value.value = input;
      render()
		}, 750);
  };

  //keyup event is not triggered when pasting with mouse
  function handlePaste (e, value) {
    const text = e.clipboardData.getData('text');
    value.value = text;
    render();
  };

  //alert window when code is copied
  function copyAlert () {
    getModal("alert").open();
    setTimeout(()=> {
      getModal("alert").close();
    }, 700)
  };

  //for a simpler each loop assign selected element's inputs to a variable 
  $: inputFields = Object.entries($input[$element]);


</script>

<!-- element selector -->
<div class="input-wrapper">
  <label for="type">
    Component
  </label>
  <select id="type" name="type" bind:value={$element} on:change="{()=>{resetInput(); render(); }}">
    <option value="mainpromo">Main promo</option>
    <option value="secondarypromo">Secondary promo</option>
    <option value="marketingblock">Marketingblock</option>
  </select>

  <!-- label for inputs -->
  {#each inputFields as [key, values] ,i}
    <label for={key}>
      {values.name}
    </label>

    <!-- select input -->
    {#if values.type === "select"}
      <select id={key} name="type" bind:value={$input[$element][key].value} on:change="{render}">
        {#each values.options as {name, value}}
          <option value={value}>{name}</option>
        {/each}
      </select>

    <!-- checkbox input -->
    {:else if values.type === 'checkbox'}
    <!-- svelte-ignore component-name-lowercase -->
    <input type="checkbox" id={key} bind:checked={values.value} on:change="{render}" disabled="{$input.marketingblock.variant.value === "video"}">
    
    <!-- text input -->
    {:else if values.type === 'input'}
    <!-- svelte-ignore component-name-lowercase -->
    <input id={key} 
      on:keyup={( {currentTarget: {value}})=>debounce($input[$element][key], value)} 
      on:paste={(e) => handlePaste(e, $input[$element][key])}
      bind:value={values.value}
    >
    <i class="ri-close-line clearbtn" on:click="{()=>clearInput(key)}"></i>  
    {/if}
  
  {/each}


    <!-- buttons  -->
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

  <!-- alert modal -->
  <Modal id="alert">
    <div class="copy-message">
      <p>Code Copied!</p>
      <i class="ri-check-line" id="check"></i>
    </div>
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
  
  .ri-close-line {
    font-size: 2.25rem;
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


  .copy-message {
    display: flex;
    align-items: center;

  }
  .copy-message > i {
    font-size: 6rem;
    color: #02BE8A;
  }
</style>