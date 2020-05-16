# Stencil Forms

    npm install --save-dev adamdbradley/stencil-forms

### Is this production ready?

Nope 🔥

### Should I start using this?

Probably not 🔥

### Is the API stable?

Not even close 🔥

### When will this be ready?

No clue 🔥

## Goals

- Reduce boilerplate in order to wire-up reactive inputs
- Do not re-invent form validation, but rather use [web standardized validation](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) already provided by the browser
- User provides the actual input elements and any attributes in order to use existing [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) rather than providing a new API for validation
- Do not provide any sort of UI, but rather provide utilities to make it easier to build custom UI which works directly with standards-based form validation
- Accessibility out-of-the-box by linking inputs to their labels, descriptions and error messages with the appropriate aria attributes
- Default to standard event listeners, such as `onInput` and `onChange`, but allow for custom event names that trigger value change events, such as Ionic's `ionOnChange`.

## Example

```tsx
import { Component, h, Host, Prop } from '@stencil/core';
import { bind } from '@stencil/forms';

@Component({
  tag: 'my-form',
})
export class MyForm {
  @Prop() firstName = 'Marty';

  render() {
    const firstName = bind(this, 'firstName');

    return (
      <Host>
        <input {...firstName()} />
      </Host>
    );
  }
}
```

```html
<input id="firstname" name="firstName" value="Marty">
```

## Labels and Accessibility

- Links the various elements together using `id` and aria attributes, such as `aria-labelledby`, `aria-describedby`, and `aria-errormessage`
- Links the `<label>` element to the `<input>` using label's `for` attribute
- Adds the `aria-labelledby` attribute when the labelling element is not a `<label>`

```tsx
render() {
  const firstName = bind(this, 'firstName');

  return (
    <Host>
      <label {...labelFor(firstName)}>
        First Name
      </label>
      <p {...descriptionFor(firstName)}>
        Please enter your first name below:
      </p>
      <input {...firstName()} />
    </Host>
  );
}
```

```html
<label id="firstname-lbl" for="firstname">First Name</label>
<p id="firstname-desc">Please add your first name below:</p>
<input id="firstname" name="firstName" aria-describedby="firstname-desc" aria-labelledby="firstname-lbl" value="Marty">
```

## Checkbox

```tsx
render() {
  const vegetarian = bindBoolean(this, 'vegetarian');

  return (
    <Host>
      <input type="checkbox" {...vegetarian()} />
    </Host>
  );
}
```

## Radio Group

```tsx
render() {
  const favoriteCar = bindGroup(this, 'favoriteCar');

  return (
    <Host>
      <section {...favoriteCar()}>
        <h2 {...labelFor(favoriteCar)}>Favorite Car</h2>
        <p {...descriptionFor(favoriteCar)}>What's your favorite car?</p>
        <div>
          <label {...labelFor(favoriteCar, 'mustang')}>Mustang</label>
          <input type="radio" {...favoriteCar('mustang')} />
        </div>
        <div>
          <label {...labelFor(favoriteCar, 'camaro')}>Camaro</label>
          <input type="radio" {...favoriteCar('camaro')} />
        </div>
        <div>
          <label {...labelFor(favoriteCar, 'challenger')}>Challenger</label>
          <input type="radio" {...favoriteCar('challenger')} />
        </div>
      </section>
    </Host>
  );
}
```

```html
<section id="favoritecar" role="group" aria-labelledby="favoritecar-lbl" aria-describedby="favoritecar-desc">
  <h2 id="favoritecar-lbl">Favorite Car</h2>
  <p id="favoritecar-desc">What's your favorite car?</p>
  <div>
    <label id="favoritecar-mustang-lbl" for="favoritecar-mustang">Mustang</label>
    <input type="radio" id="favoritecar-mustang" value="mustang" aria-labelledby="favoritecar-mustang-lbl">
  </div>
  <div>
    <label id="favoritecar-camaro-lbl" for="favoritecar-camaro">Camaro</label>
    <input type="radio" id="favoritecar-camaro" value="camaro" aria-labelledby="favoritecar-camaro-lbl">
  </div>
  <div>
    <label id="favoritecar-challenger-lbl" for="favoritecar-challenger">Challenger</label>
    <input type="radio" id="favoritecar-challenger" value="challenger" aria-labelledby="favoritecar-challenger-lbl">
  </div>
</section>
```

## Validation

Form validation uses the browser's built-in [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState).

## Bind Options

`ReactiveFormBindOptions`

https://github.com/adamdbradley/stencil-forms/blob/master/src/types.ts


## Advanced

https://github.com/adamdbradley/stencil-forms/blob/master/src/test/src/my-form.tsx

`control()`

`controlBoolean()`

`controlGroup()`
