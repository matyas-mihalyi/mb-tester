import { backgroundImage, href } from "../templates";
import type { Input } from "../stores";

//check if video is hosted on youtube
const isYouTube = (url) => /youtube/.test(url);

//convert youtube links to embed links for video marketingblocks
const embedLink = (url):string => {
  return isYouTube(url) ?
    url.replace("watch?v=", "embed/")
  :
    url
};

//get random id for video modal
const modalid = Math.floor(Math.random() * (1000 - 1) + 1);


export function renderMarketingblock (input:Input):string  {
  //regular marketingblocks
  if (input.variant.value !== "video") {
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
    <a class="mb ${input.variant.value}" ${input.newtab.value ? 'target="_blank"' : ''} href="${href(input.href.value)}" onclick='
          let url = window.location.href; 
          let mbLocation = url.replace(/.*\\/(c[A-Za-z0-9-]+)\\/.*?\\/_.*$/, "$1");
          ga("transcript.send",  {
              hitType: "event",
              eventCategory: "ProductListing",
              eventAction: "Marketingblock",
              eventLabel: "${input.eventlabel.value}" + "_" + mbLocation
        });
    '>
      <img src="${backgroundImage(input.picture.value).fallback}" alt="marketingblock background">
      <div class="mb-overlay"></div>
      <span class="mb-title">${input.title.value}</span>
      <button class="vtmn-btn vtmn-btn_variant--secondary-reversed" type="button">${input.buttontext.value}</button>
    </a>
    `;
  } else if (input.variant.value === "video") {
   // video modal marketingblocks 
   return `
   <div class="mb video" modal-id="${modalid}">
     <div class="mb-overlay"></div>
     <img src="${backgroundImage(input.picture.value).fallback}" alt="background" />        
     <span class="mb-title">${input.title.value}</span>
     <button class="vtmn-btn vtmn-btn_variant--secondary-reversed" type="button">${input.buttontext.value}</button>
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
   
     const openBtn = document.querySelector('div.mb.video[modal-id="${modalid}"] button');
     console.log(openBtn);
     const videoModal = document.querySelector('div.mb-video-modal[modal-id="${modalid}"]');
     const videoPlayer = videoModal.querySelector('iframe');
     const videoSrc = "${embedLink(input.href.value)}";
     let gaTimeout15s;
     let gaTimeout45s;
   
     openBtn.onclick = () => {                               //click on tile
       videoModal.classList.toggle("mb-video-modal-active");  //opens modal
       videoPlayer.classList.toggle("iframe-active");       // iframe animation
       videoPlayer.src = videoSrc;                          // inserts video source to iframe
       gaTimeout15s = setTimeout(() => {
         ga('transcript.send', 'event', 'ProductListing', 'MarketingBlock', '${input.eventlabel.value}_15sec<');
       }, 15000);                                          // sends ga event if the modal is open for >15s
       gaTimeout45s = setTimeout(() => {
         ga('transcript.send', 'event', 'ProductListing', 'MarketingBlock', '${input.eventlabel.value}_45sec<');
       }, 45000);                                          // sends ga event if the modal is open for >45s
     }
   
     videoModal.addEventListener("click", (e) => {                 //when modal is open
       if (e.target != videoPlayer) {                             
         videoModal.classList.toggle("mb-video-modal-active");
         videoPlayer.classList.toggle("iframe-active");
         clearTimeout(gaTimeout15s);
         clearTimeout(gaTimeout45s);                                 
         ga('transcript.send', 'event', 'ProductListing', 'Marketingblock', '${input.eventlabel.value}_closed'); 
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