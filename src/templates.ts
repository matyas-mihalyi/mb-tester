import { element } from './stores';
import { get } from 'svelte/store';

const elementRef = () => {return get(element)};

export function _render (obj:any, isTest:boolean) {
  switch (elementRef()) {

    //Marketingblock
    case "marketingblock": {
      const img = `${obj.picture.value}?format=auto&f=380x380&quality=80`; //add size & quality tags
      let url = obj.href.value;
      if (isTest) {
      url = `https://www.decathlon.hu${obj.href.value}`;
      };
      const type = () => {
        switch (obj.variant.value) {
          case "white":
            return "";
          case "black":
            return "black";
          case "sales":
            return "sales"        
        }
      };

      return `
        <script>  
          const stylesheet = document.querySelector('link[href="/static/css/marketingblocks.css"]');  
          if (!stylesheet) {
            const link = document.createElement('link');
            link.href = '/static/css/marketingblocks.css';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            document.head.appendChild(link);
          }
        </script>
        <a class="mb ${type()}" ${obj.newtab.value ? 'target="_blank"' : ''} href="${url}" onclick='
              let url = window.location.href; 
              let mbLocation = url.replace(/.*\/(c[A-Za-z0-9-]+)\/.*?\/_.*$/, "$1");
              ga("transcript.send",  {
                  hitType: "event",
                  eventCategory: "ProductListing",
                  eventAction: "Marketingblock",
                  eventLabel: \${'${obj.eventlabel.value}' + "_" + "mbLocation"}
            });
          '>
        <img src="${img}" alt="choose a background">
        <div class="mb-overlay"></div>
        <span class="mb-title">${obj.title.value}</span>
        <button class="vtmn-btn vtmn-btn_variant--secondary-reversed" type="button">${obj.buttontext.value}<span
            class="material-icons">${obj.newtab.value ? 'open_in_new' : 'chevron_right'}</span></button>
        </a>
      `;
      }

      //Main Promo
      case "mainpromo": {
        const img = `${obj.picture.value}?format=auto&f=800x600&quality=80`; //add size & quality tags
        
        return isTest?
        `<img loading="eager" src="${img}" alt="choose a background">
        <span class="overlay"></span>
        <span data-display="no" class="price">1000 Ft-tól</span>
        <div data-sport="futas" class="badge">${obj.badge.value}</div>
        <div class="category">${obj.title.value}</div>
        <div class="ctaa">Megnézem<span class="material-icons">chevron_right</span></div>
        `
        :
        `
        <a onclick="ga('transcript.send', 'event', 'Homepage', 'MainPromo', '${obj.eventlabel.value}');" href="${obj.href.value}" class="promo-block">
        <img loading="eager" src="${img}" alt="">
        <span class="overlay"></span>
        <span data-display="no" class="price">1000 Ft-tól</span>
        <div data-sport="futas" class="badge">${obj.badge.value}</div>
        <div class="category">${obj.title.value}</div>
        <div class="ctaa">Megnézem<span class="material-icons">chevron_right</span></div>
        </a>
        `;
      }
      
      //Secondary Promo
      case "secondarypromo": {
        const img = `${obj.picture.value}?format=auto&f=400x300&quality=80`; //add size & quality tags
        return isTest?
        `          
        <span class="overlay"></span>
        <img loading="eager" id="block3" data-position="auto" src="${img}" alt="choose a background">
        <span data-display="no" class="price">1000 Ft-tól</span>
        <div class="badge">${obj.badge.value}</div>
        <div class="category">${obj.title.value}</div>
        `        
        :
         `
          <a loading="eager" href=${obj.href.value} onclick="ga('transcript.send', 'event', 'Homepage', 'SecondaryPromo', '${obj.eventlabel.value}');" class="block">
           <span class="overlay"></span>
            <img loading="eager" id="block3" data-position="auto" src="${img}" alt="">
            <span data-display="no" class="price">1000 Ft-tól</span>
            <div class="badge">${obj.badge.value}</div>
            <div class="category">${obj.title.value}</div>
          </a>
        `;
      }
      default:
        return "default";
    }



  };





  

