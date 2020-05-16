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

```tsx
render() {
  const firstName = bind(this, 'firstName');

  return (
    <Host>
      <label {...labelFor(firstName)}>
        First Name
      </label>
      <p {...descriptionFor(pkgName)}>
        Please add your first name below:
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
  const favoriteCar = groupBoolean(this, 'favoriteCar');

  return (
    <Host>
      <section {...favoriteCar()}>
        <div {...labelFor(favoriteCar)}>Favorite Car</div>
        <div {...descriptionFor(favoriteCar)}>What's your favorite car? {this.favoriteCar}</div>
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
