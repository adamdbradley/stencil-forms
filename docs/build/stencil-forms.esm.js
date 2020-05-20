import { p as patchBrowser, b as bootstrapLazy } from './index-8c092451.js';
import { g as globalScripts } from './app-globals-0f993ce5.js';

patchBrowser().then(options => {
  globalScripts();
  return bootstrapLazy([["my-form",[[0,"my-form",{"fullName":[1,"full-name"],"email":[1],"userName":[1,"user-name"],"age":[2],"volume":[2],"vegetarian":[4],"specialInstructions":[1,"special-instructions"],"favoriteCar":[1,"favorite-car"],"counter":[2],"json":[32]}]]]], options);
});
