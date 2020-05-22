# `@stencil/forms` 🥒 _(candidate)_

    npm install --save-dev adamdbradley/stencil-forms

Demo: https://adamdbradley.github.io/stencil-forms/

Source: https://github.com/adamdbradley/stencil-forms/blob/master/src/test/src/my-form.tsx

--------------

### Is this production ready?

Nope 🔥

### Should I start using this?

Probably not 🔥

### Is the API stable?

Not even close 🔥

### When will this be ready?

No clue 🔥

## Goals

- Reduce boilerplate and complexity in order to wire-up reactive inputs
- Do not re-invent form validation, but rather provide utility functions on top of [web standardized validation](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) already provided by the browser
- User provides the actual input elements and any attributes in order to use existing [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) rather than providing a new API
- Do not provide any sort of UI, but rather provide utilities to make it easier to build custom UI which works directly with standards-based form validation
- Improve Accessibility right out-of-the-box by linking inputs to their labels, descriptions and error messages with the appropriate [aria attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/forms/Basic_form_hints)
- Type all form values in order to speed up development and refactoring by printing errors when binding values are not correctly set
- Do not require a specific HTML structure in order for the library to work
- Do not provide custom JSX/HTML output so that developers can continue to build custom forms for their UI without interference from the library
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

HTML Output:

```html
<input id="firstname" name="firstName" value="Marty">
```

## Labels and Accessibility

- [Basic form hints](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/forms/Basic_form_hints)
- Links the various elements together using `id` and aria attributes, such as `aria-labelledby`, `aria-describedby`, `aria-errormessage`,  and `aria-invalid`.
- Links the `<label>` element to the `<input>` using label's `for` attribute.
- Adds the `aria-labelledby` attribute when the labelling element is not a `<label>`.
- Ensures unique id's are added so elements can establish a relationship.

### Labelling Elements

| Method | Description |
|--------|-------------|
| `labelFor(ctr)` | The `labelFor(ctrl)` method is used to establish a relationship between an input control and this text that labels it. When the labelling element is an actual `<label>`, it will add the `for` attribute to the label, pointing it to the correct control id. When the labelling element is not a `<label>` it will then use `aria-labelledby`. |
| `validationFor(ctr)` | The `validationFor(ctrl)` method is used to establish a relationship between an input control and it's error message. When using this method, the element it's attached to will automatically link up the error by adding the `aria-errormessage` attribute to the control element, and a unique id to the message element. Additionally, it will add `role="alert"` and `aria-atomic="true"` to the message element. |
| `descriptionFor(ctr)` | The `descriptionFor(ctrl)` method is used to establish a relationship between an input control and this text that described it. This is very similar to label, but the description provides more information that the user might need. When using this method, the element it's attached to will automatically link up the description by adding the `aria-describedby` attribute to the control element, and a unique id to the description element. |

### Message Output

| Method | Description |
|--------|-------------|
| `validationMessage(ctrl)` | If the value has changed, or control has been "touched", and if the value does not pass the browser's [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) then this method returns the message provided by the browser and the custom validation method will not be called. If the value does pass constraint validation then the custom `validation()` method will be called and returns the message. If the value passes both the constraint validation and custom valdation, then this method returns and empty string. |
| `activelyValidatingMessage(ctrl)` | If a custom validation method was provided, and returns a promise, this method will return the message provided in `validatingMessage`. All other times this method will return an empty string. |

See the Validation Message section for more info on how to customize messages.

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

HTML Output:

```html
<label id="firstname0-lbl" for="firstname">First Name</label>
<p id="firstname0-desc">Please add your first name below:</p>
<input id="firstname0" name="firstName" aria-describedby="firstname0-desc" aria-labelledby="firstname0-lbl" value="Marty">
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

HTML Output:

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

## CSS Pseudo-Class

A great feature due to this library's use of the browser's native form validation is that
it's baked-in with  with some very useful CSS pseudo-classes for inputs and forms.
__Using CSS pseudo-classes is our first recommendation when styling form validation.__

For example, the `:invalid` [pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:invalid) 
will automatically apply to an invalid input, and to it's wrapping `<form>` element. Below are some
useful form and input specific CSS pseudo-classes.

- [:checked](https://developer.mozilla.org/en-US/docs/Web/CSS/:checked)
- [:default](https://developer.mozilla.org/en-US/docs/Web/CSS/:default)
- [:disabled](https://developer.mozilla.org/en-US/docs/Web/CSS/:disabled)
- [:enabled](https://developer.mozilla.org/en-US/docs/Web/CSS/:enabled)
- [:focus](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus)
- [:focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [:focus-within](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within)
- [:indeterminate](https://developer.mozilla.org/en-US/docs/Web/CSS/:indeterminate)
- [:invalid](https://developer.mozilla.org/en-US/docs/Web/CSS/:invalid)
- [:in-range](https://developer.mozilla.org/en-US/docs/Web/CSS/:in-range)
- [:optional](https://developer.mozilla.org/en-US/docs/Web/CSS/:optional)
- [:out-of-range](https://developer.mozilla.org/en-US/docs/Web/CSS/:out-of-range)
- [:placeholder-shown](https://developer.mozilla.org/en-US/docs/Web/CSS/:placeholder-shown)
- [:read-write](https://developer.mozilla.org/en-US/docs/Web/CSS/:read-write)
- [:read-only](https://developer.mozilla.org/en-US/docs/Web/CSS/:read-only)
- [:required](https://developer.mozilla.org/en-US/docs/Web/CSS/:required)
- [:valid](https://developer.mozilla.org/en-US/docs/Web/CSS/:valid)

Here is an example of styling an invalid `<textarea>`:

```css
textarea:invalid {
  border: 1px solid red;
}
```

## Validation Utilities

We first recommend styling using only the CSS pseudo-classes, however, in some situations, 
the may not be enough to get the full styling required, such as styling a wrapping element 
around an invalid input. The input itself can be easily styled, but styling the surrounding 
element, or an element in entirely different part of the DOM is a challenge. If further
customization, these utility methods are available:

| Method | Description |
|--------|-------------|
| `isActivelyValidating(ctrl)` | If a custom validation method was provided, and returns a promise, this method will return `true` if the validation method is still pending. All other times this method will return `false`. |
| `isDirty(ctrl)` | When the user changes the value of the form control element, the control is "dirty" and this method returns `true`. If control's initial value has not changed then this method returns `false`. |
| `isInvalid(ctrl)` | If the value has changed or control has been "touched", and if the value does not pass the browser's [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) then this method returns `true` and the custom validation method will not be called. If the value does pass constraint validation then the custom `validation()` method will be called, and if the custom validation method returns a message then this method will return `true`. If the value passes both the constraint validation and custom valdation, then this method returns `false`. However, if custom validation is async and is pending a response then this method will return `null`. |
| `isTouched(ctrl)` | When the user blurs the form control element, the control is marked as "touched" and this method returns `true`. If the control has not had a blur event then this method will return `false`. |
| `isValid(ctrl)` | If the value has changed, or control has been "touched", and if the value does not pass the browser's [constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) then this method returns `false` and the custom validation method will not be called. If the value does pass constraint validation then the custom `validation()` method will be called, and if the custom validation method returns a message then this method will return `false`. If the value passes both the constraint validation and custom valdation, then this method returns `true`. However, if custom validation is async and is pending a response then this method will return `null`. |

When showing and hiding validation messages and displays, it's always best to change their
display using CSS classes or HTML attributes. While methods like `isInvalid(ctrl)` can be 
used to conditionally render within JSX, it's recommended to instead keep the same HTML 
structure in place. By keeping the same structure, this ensures elements like `<input>` 
are not relocated, which in many cases will cause the input to either loose focus, or 
the cursor position is not maintained while the user is typing (which I'm sure you can 
agree would be quite frustrating). 

The recommended way to conditionally show and hide validation messages is by either changing the CSS classes on the element, or changing the `hidden` attribute. 

```tsx
render() {
  return (
    <Host class={{
      'is-invalid': isInvalid(mph)
    }}>
      <label {...labelFor(mph)}>Miles Per Hour:</label>
      <input type="number" {...mph()}>
      <p hidden={isValid(mph)}>{validationMessage(mph)}</p>
    </Host>
  );
}
```

In the example above, the `is-invalid` CSS class would be added to the wrapping element when
the `age` input is invalid, because the utility `isInvalid(age)` would return `true`. This 
library does not provide any default CSS, or use specific CSS class names which apps must 
use. Instead, whatever your CSS class does to show this input is invalid is up to the app, 
and even the CSS class name can be decided by the developer.

Additionally, this example is also showing how the `hidden` attribute can be used on an 
element to show and hide the validation message. Note that the HTML structure is always the 
same, and it's actually only changing the attributes. Again it's recommended to always keep 
the same HTML structure in order to prevent inputs from loosing focus or cursor position while
the user is typing.


## Validation

Form validation uses the browser's built-in 
[constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) first. For example, if the `required` attribute is added to an `<input>`,
the browser's default validation and message will apply first. If an input does pass the browser's
constraint validation it will then check against an optionally provided `validate()` method.

The validate method should return a custom message as a string, and will use the browser's
[ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) to inform
the browser the input is not valid, and the form cannot be submitted. Note that this library
does not attach any listeners to a `<form>` element's `submit` event, but is instead built
around the browser's native implementation of validation, which will not submit the form 
if it's invalid.

If a `validate()` function is not provided, or it returns `null`, `undefined` or an empty string,
and the input passes the constraint validation, then the input is considered valid.

### Validation Message

By default, an validation message will display using the browser's defaul UI. However, to customize
the display you can use the `validationMessage(ctrl)` method. When validationMessage() is used instead,
then the browser's default UI is prevented with the `formnovalidate` attribute, and your custom
validation method is displayed within the template. By placing the message within the template, this
gives developers full control on styling and your form's custom UI.

```tsx
render() {
  const age = bindNumber(this, 'age', {
    validate: (value) => {
      if (value < 18) {
        return `Must be 18 or older, but you entered ${value}`;
      }
    },
  });

  return (
    <Host>
      <label {...labelFor(age)}>What's my age again?</label>
      <input {...age()}>
      <div hidden={isValid(age)}>
        {validationMessage(age)}
      </div>
    </Host>
  );
}
```

### Async Validation

In most cases it may be best to have the validation synchronous. However, some scenarios may
way to hit an external server to validate an input, requiring the validation to be asynchronous.

The custom validate method can also return a `Promise`, which should resolve with a string value (empty
string meaning the value is valid). While the active validation is pending, a custom validating message
can be provided and can be shown until the validation is done. 

```tsx
render() {
  const userName = bind(this, 'userName', {
    debounce: 500,
    validate: (value) => {
      console.log(`checking "${value}" username, this will take 2 seconds...`);
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`finished checking "${value}" username`);
          resolve('');
        }, 2000);
      });
    },
    activelyValidatingMessage: (value) => {
      return `Checking if "${value}" is already taken...`;
    },
  });

  return (
    <Host>
      <label {...labelFor(userName)}>User Name:</label>
      <input {...userName()}>
      <div hidden={!isActivelyValidating(userName)}>
        <img src="spinner.gif"/>
        {activelyValidatingMessage(age)}
      </div>
      <div hidden={isValid(userName)}>
        {validationMessage(userName)}
      </div>
    </Host>
  );
}
```

In the example above, the input will first debounce for 500ms. After the user has stopped typing for
500ms, this example returns a promise that resolves in 2 seconds. In a real world example
this could be a `fetch()` request to an API. While the validation is actively pending, the 
optional `validatingMessage(value)` is used to get the message to show while checking. Additionally,
the `isActivelyValidating(ctrl)` utility method can be used to customize CSS classes or attributes
to change the UI, and the `activelyValidatingMessage(ctrl)` method is used to get the custom message.

Once the promise resolves, the resolved value is used as the validation message. An empty string means
the value is valid, otherwise a string with a custom message means it is invalid. 

## Bind Options

`ReactiveFormBindOptions`

https://github.com/adamdbradley/stencil-forms/blob/master/src/types.ts

## Advanced

https://github.com/adamdbradley/stencil-forms/blob/master/src/test/src/my-form.tsx

`control()`

`controlBoolean()`

`controlGroup()`
