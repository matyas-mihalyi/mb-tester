import { backgroundImage, href } from "../templates";
import type { Input } from "../stores";


export const renderMainPromo = (input:Input, isTest:boolean):string => {
  return isTest?
    `
    <picture>
      <source media="(max-width: 600px)" loading="eager" srcset="${backgroundImage(input.picture.value).mobile}" alt="Homepage mobile image">
      <source media="(min-width: 601px)" loading="eager" srcset="${backgroundImage(input.picture.value).desktop}" alt="Homepage desktop image">
      <img loading="eager" src="${backgroundImage(input.picture.value).fallback}" alt="Homepage fallback image">
    </picture>
    <span class="overlay"></span>
    <span data-display="no" class="price">1000 Ft-tól</span>
    <div data-sport="futas" class="badge">${input.badge.value}</div>
    <div class="category">${input.title.value}</div>
    <div class="ctaa">Megnézem<span class="material-icons">chevron_right</span></div>
    `
    :
    `
    <a onclick="ga('transcript.send', 'event', 'Homepage', 'MainPromo', '${input.eventlabel.value}');" href="${href(input.href.value)}" class="promo-block">
      <picture>
        <source media="(max-width: 600px)" loading="eager" srcset="${backgroundImage(input.picture.value).mobile}" alt="Homepage mobile image">
        <source media="(min-width: 601px)" loading="eager" srcset="${backgroundImage(input.picture.value).desktop}" alt="Homepage desktop image">
        <img loading="eager" src="${backgroundImage(input.picture.value).fallback}" alt="Homepage fallback image">
      </picture>
      <span class="overlay"></span>
      <span data-display="no" class="price">1000 Ft-tól</span>
      <div data-sport="futas" class="badge">${input.badge.value}</div>
      <div class="category">${input.title.value}</div>
      <div class="ctaa">Megnézem<span class="material-icons">chevron_right</span></div>
    </a>
    `;
  };
