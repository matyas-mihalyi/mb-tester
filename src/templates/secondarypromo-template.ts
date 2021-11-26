import { backgroundImage, href } from "../templates";
import type { Input } from "../stores";


export const renderSecondaryPromo = (input:Input, isTest:boolean) => {
  return isTest?
    `          
    <span class="overlay"></span>
    <picture>
      <source media="(max-width: 600px)" loading="eager" srcset="${backgroundImage(input.picture.value).mobile}" alt="Homepage mobile image">
      <source media="(min-width: 601px)" loading="eager" srcset="${backgroundImage(input.picture.value).desktop}" alt="Homepage desktop image">
      <img loading="eager" src="${backgroundImage(input.picture.value).fallback}" alt="Homepage fallback image">
    </picture>
    <span data-display="no" class="price">1000 Ft-tól</span>
    <div class="badge">${input.badge.value}</div>
    <div class="category">${input.title.value}</div>
    `        
    :
    `
    <a loading="eager" href=${href(input.href.value)} onclick="ga('transcript.send', 'event', 'Homepage', 'SecondaryPromo', '${input.eventlabel.value}');" class="block">
      <span class="overlay"></span>
      <picture>
        <source media="(max-width: 600px)" loading="eager" srcset="${backgroundImage(input.picture.value).mobile}" alt="Homepage mobile image">
        <source media="(min-width: 601px)" loading="eager" srcset="${backgroundImage(input.picture.value).desktop}" alt="Homepage desktop image">
        <img loading="eager" src="${backgroundImage(input.picture.value).fallback}" alt="Homepage fallback image">
      </picture>
      <span data-display="no" class="price">1000 Ft-tól</span>
      <div class="badge">${input.badge.value}</div>
      <div class="category">${input.title.value}</div>
    </a>
    `;
};
