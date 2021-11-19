import { element } from './stores';
import { get } from 'svelte/store';

const elementRef = () => {return get(element)};


export function _render (obj:any, isTest:boolean) {
  const isPixl = () => /mediadecathlon/.test(obj.picture.value);
  
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
  
  const url = obj.href.value.replace(/http.*\.hu(.*)/, "$1");

  switch (elementRef()) {
    
    
    //Marketingblock
    case "marketingblock": {

      let img = obj.picture.value;
      if (isPixl()) {
        img = `${obj.picture.value}?format=auto&f=300x0&quality=80`; //add size & quality tags
      };
      let url = obj.href.value;
      if (isTest) {
        url = `https://www.decathlon.hu${obj.href.value}`;
      };
    
      const modalid = Math.floor(Math.random() * (1000 - 1) + 1);

      if (obj.variant.value !== "video") {
        return `
          <script>  
            let stylesheet = document.querySelector('link[href="/static/css/marketingblocks.css"]');  
            if (!stylesheet) {
              const link = document.createElement('link');
              link.href = '/static/css/marketingblocks.css';
              link.rel = 'stylesheet';
              link.type = 'text/css';
              document.head.appendChild(link);
            };
          </script>
          <a class="mb ${obj.variant.value}" ${obj.newtab.value ? 'target="_blank"' : ''} href="${url}" onclick='
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
          </a>
          `;
        } else {
          //VIDEO MODAL
          return `
          <div class="mb video" modal-id="${modalid}">
            <div class="mb-overlay"></div>
            <img src="${img}" alt="background" />        
            <span class="mb-title">${obj.title.value}</span>
            <button class="vtmn-btn vtmn-btn_variant--secondary-reversed" type="button">${obj.buttontext.value}</button>
          </div>
        
        
          <div class="mb-video-modal" modal-id="${modalid}">
            <iframe src="" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
              <span class="material-icons">close</span>
          </div>
          
          <script>
            let stylesheet = document.querySelector('link[href="/static/css/marketingblocks.css"]');  
            if (!stylesheet) {
              const link = document.createElement('link');
              link.href = '/static/css/marketingblocks.css';
              link.rel = 'stylesheet';
              link.type = 'text/css';
              document.head.appendChild(link);
            };
          
            const openBtn = document.querySelector('div.mb.video[modal-id="${modalid}"]');
            const videoModal = document.querySelector('div.mb-video-modal[modal-id="${modalid}"]');
            const videoPlayer = videoModal.querySelector('iframe');
            const videoSrc = "${obj.href.value}";
            let gaTimeout15s;
            let gaTimeout45s;
          
            openBtn.onclick = () => {                               //click on tile
              console.log("miééééééééééért")
              videoModal.classList.toggle("mb-video-modal-active");  //opens modal
              videoPlayer.classList.toggle("iframe-active");       // iframe animation
              videoPlayer.src = videoSrc;                          // inserts video source to iframe
              gaTimeout15s = setTimeout(() => {
                ga('transcript.send', 'event', 'ProductListing', 'MarketingBlock', '${obj.eventlabel.value}_15sec<');
              }, 15000);                                          // sends ga event if the modal is open for >15s
              gaTimeout45s = setTimeout(() => {
                ga('transcript.send', 'event', 'ProductListing', 'MarketingBlock', '${obj.eventlabel.value}_45sec<');
              }, 45000);                                          // sends ga event if the modal is open for >45s
            }
          
            videoModal.addEventListener("click", (e) => {                 //when modal is open
              if (e.target != videoPlayer) {                             
                videoModal.classList.toggle("mb-video-modal-active");
                videoPlayer.classList.toggle("iframe-active");
                clearTimeout(gaTimeout15s);
                clearTimeout(gaTimeout45s);                                 
                ga('transcript.send', 'event', 'ProductListing', 'Marketingblock', '${obj.eventlabel.value}_closed'); 
              }
            })
          
            videoPlayer.ontransitionend = () => {                       
              if (!videoPlayer.classList.contains("iframe-active")) {
                videoPlayer.src = "";
              }
            }
          
          </script>
              `;
        }
      };

      //Main Promo
      case "mainpromo": {
        let img = obj.picture.value;
        if (isPixl()) {
          img = `${obj.picture.value}?format=auto&f=0x600&quality=80`; //add size & quality tags
        };
        
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

        let img = obj.picture.value;
        if (isPixl()) {
          img = `${obj.picture.value}?format=auto&f=0x250&quality=70`; //add size & quality tags
        };
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




