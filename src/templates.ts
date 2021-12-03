import { element, Element, Input, input, SelectInput } from './stores';
import { get } from 'svelte/store';
import { renderMarketingblock } from './templates/marketingblock-template';
import { renderMainPromo } from './templates/mainpromo-template';
import { renderSecondaryPromo } from './templates/secondarypromo-template';

const elementRef = () => {return get(element)};


//Quality tags to format backgroud pictures

type QualityTags = {
  [propName in Element]: {
    mobile:string,
    desktop:string,
    fallback:string
  }
};

const qualityTags:QualityTags = {
  marketingblock: {
    mobile:"?format=auto&f=0x180&quality=80",
    desktop:"?format=auto&f=300x0&quality=80",
    fallback:"?format=auto&f=300x0&quality=80"
  },
  mainpromo: {
    mobile: "?format=auto&f=0x245&quality=80",
    desktop: "?format=auto&f=0x600&quality=80",
    fallback: "?format=auto&f=0x600&quality=80"
  },
  secondarypromo: {
    mobile: "?format=auto&f=0x130&quality=70",
    desktop: "?format=auto&f=0x250&quality=70",
    fallback: "?format=auto&f=0x250&quality=70"
  }
};

//quality tags for current element to render
const pictureQualityTag = qualityTags[elementRef()];

//check if picture is hosted on mediadecathlon.com
const isPixl = (url) => /mediadecathlon/.test(url);

//remove quality tags that were pasted
function removeQualityTags (url):string  {
  return url.replace(/(.*\.jpg).*/, "$1");
};  

export const backgroundImage = (url) => {
  return isPixl(url) && url !== "" ?
    {
      mobile: removeQualityTags(url) + qualityTags[elementRef()].mobile,
      desktop: removeQualityTags(url) + qualityTags[elementRef()].desktop,
      fallback: removeQualityTags(url) + qualityTags[elementRef()].fallback
    }
    :
    url;    
};

//check for vertical image -----no need for now
// let isvertical = false;
// const img = new Image();
// img.src = obj.picture.value;
// img.onload = () => {    
//   if (img.height > img.width) {
//     console.log("img is vertical")
//     isvertical = true;
//   }
// } 

//remove unnecessary domain name from url
export const href = (url) => url.replace(/http.*\.hu(.*)/, "$1");

//return the desired html element in string
export function renderElement (input:Input, isTest:boolean): string {

  switch (elementRef()) {    
    case "marketingblock":
      return renderMarketingblock(input);
    case "mainpromo": 
      return renderMainPromo(input, isTest);
    case "secondarypromo": 
      return renderSecondaryPromo(input, isTest);
    default:
      return "nothing to render"
  };

};


