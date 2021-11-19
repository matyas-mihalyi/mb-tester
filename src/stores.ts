import { writable } from "svelte/store";

type BaseInput = {
  name:string;
  type: "input" | "checkbox" | "select";
}

export interface TextInput extends BaseInput {
  type: "input"
  value:string|number|string[];
};
export interface SelectInput extends BaseInput{
  type: "select"
  options:Array<{name:string,value:string}>;
  value:string|number|string[];
};
export interface CheckboxInput extends BaseInput{
  type: "checkbox"
  value:boolean;
};


type Input = {
  [propName:string]:TextInput|SelectInput|CheckboxInput
}

type Element = "marketingblock" | "mainpromo" | "secondarypromo";

type ElementType = {
  [propName in Element]: Input;
};

export const toRender = writable<string>("");
export const toCopy = writable<string>("");
export const element = writable<Element>("mainpromo");
export const input = writable<ElementType>({
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
        },
        {
          name: "Video modal",
          value: "video"
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
      type: 'checkbox',
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
})