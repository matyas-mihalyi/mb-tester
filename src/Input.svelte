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
import {toRender, toCopy, element} from './stores'


  let _element = "marketingblock" 
  $: {  
    element.set(_element)
  };

  let input:any = {
    //Marketingblock
    marketingblock:{
      title:{
        name: 'Title',
        value: '',
        type: 'input'
      },
      buttontext:{
        name: 'Button text',
        value: '',
        type: 'input'
      },
      href:{
        name: 'Link',
        value: '',
        type: 'input'
      },
      picture:{
        name: 'Background',
        value: '',
        type: 'input'
      },
      variant:{
        name: 'Variant',
        value: 'white',
        type: 'select',
        options: [
          {
            name: "White",
            value: "white"
          },
          {
            name: "Black",
            value: "black"
          },
          {
            name: "Sales",
            value: "sales"
          }
        ]
      },
      eventlabel:{
        name: 'Event label',
        value: '',
        type: 'input'
      },
      newtab:{
        name: 'Open in new tab',
        value: false,
        type: 'input',
        inputType: 'checkbox'
      }
    },
    //Main promo
    mainpromo: {      
      title:{
        name: 'Category',
        value: '',
        type: 'input'
      },
      badge:{
        name: 'Badge',
        value: '',
        type: 'input'
      },
      href:{
        name: 'Link',
        value: '',
        type: 'input'
      },
      picture:{
        name: 'Background',
        value: '',
        type: 'input'
      },
      eventlabel:{
        name: 'Event label',
        value: '',
        type: 'input'
      }
    },
    //Secondary promo
    secondarypromo: {      
      title:{
        name: 'Category',
        value: '',
        type: 'input'
      },
      badge:{
        name: 'Badge',
        value: '',
        type: 'input'
      },
      href:{
        name: 'Link',
        value: '',
        type: 'input'
      },
      picture:{
        name: 'Background',
        value: '',
        type: 'input'
      },
      eventlabel:{
        name: 'Event label',
        value: '',
        type: 'input'
      }
    },
  };
  
  $: inputFields = Object.keys(input[$element]);
  
  $:{
    function render () {
      //render mb
      toRender.set(_render(input[$element], true));
      toCopy.set(_render(input[$element], false));
    };
    render();
  } 

  //HELPERS

  function copyToClipboard () {
    navigator.clipboard.writeText($toCopy);
  };

  function resetInput () {
    Object.keys(input[$element]).forEach(e => {
      const type = typeof input[$element][e].value;
      console.log(type)
      if (input[$element][e].value === "") {
        return
      } else if (input[$element][e].type === "select") {
        input[$element][e].value = input[$element][e].options[0].value;
      } else if (type === "string") {
        input[$element][e].value = "";
      } else if (type === "boolean") {
        input[$element][e].value = false;
      }
    });
  };

  //disable copy if not everything is filled
  function isDisabled () {
    return  Object.keys(input[$element]).some(e => input[$element][e].value === "");
  };

  function clearInput (field) {
    input[$element][field].value = ""
  }


</script>

<div class="input-wrapper">
  <label for="type">
    Element type
  </label>
  <select id="type" name="type" bind:value={$element}>
    <option value="mainpromo">Main promo</option>
    <option value="secondarypromo">Secondary promo</option>
    <option value="marketingblock">Marketingblock</option>
  </select>

  {#each inputFields as field,i}
    <label for={inputFields[i]}>
      {input[$element][inputFields[i]].name}
    </label>

    {#if input[$element][inputFields[i]].type === 'select'}
      <select id={inputFields[i]} name="type" bind:value={input[$element][inputFields[i]].value}>
        {#each input[$element][inputFields[i]].options as {name, value}}
          <option value={value}>{name}</option>
        {/each}
      </select>

    {:else if input[$element][inputFields[i]].type === 'input' && input[$element][inputFields[i]].inputType === 'checkbox'}
    <input type="checkbox" id={inputFields[i]} bind:value={input[$element][inputFields[i]].value}>
    {:else}
    <input type="text" id={inputFields[i]} bind:value={input[$element][inputFields[i]].value}>
    <span class="material-icons clearbtn"  on:click="{()=>clearInput(field)}">
      clear
    </span>
    {/if}
  
  {/each}



  <div class="button-wrapper">
    <button class="vtmn-btn vtmn-btn_variant--secondary" on:click="{()=> resetInput()}">
      <span class="material-icons">
        restart_alt
      </span>
      Reset
    </button>
    <button class="vtmn-btn vtmn-btn_variant--primary" on:click="{()=> copyToClipboard()}" disabled="{isDisabled()}">      
      <span class="material-icons">
        content_copy
      </span>
      Copy
    </button>
  </div>
  <!-- Buttons end -->
</div>



<style>
  .input-wrapper{
    display: flex;
    flex-wrap: wrap;
    /* align-items: flex-start; */
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
    width: 33%
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
  }

  label[for="type"] {
    font-size: 1.8rem;
    font-weight: 700;
    text-align: center;
    width: 100%;
  }
  #type {
    border: 2px solid hsl(200, 100%, 36.9%);
    border-radius: 3px;
    width: 100%;
    font-size: 1.8rem;
  }
</style>