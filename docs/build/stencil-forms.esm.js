import { b as bootstrapLazy } from './index-f99279a6.js';
import { p as patchBrowser, g as globalScripts } from './app-globals-ef7ce406.js';

patchBrowser().then(options => {
  globalScripts();
  return bootstrapLazy([["my-form",[[0,"my-form",{"login":[4],"fullName":[1,"full-name"],"email":[1],"userName":[1,"user-name"],"age":[2],"volume":[2],"vegetarian":[4],"specialInstructions":[1,"special-instructions"],"favoriteCar":[1,"favorite-car"],"counter":[2],"json":[32]}]]]], options);
});
