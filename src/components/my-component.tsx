import { Component, h, Host, Prop } from '@stencil/core';
import { input, labelFor, descriptionFor, reactiveForm, errorFor, validationMessageFor } from '../reactive-forms';

@Component({
  tag: 'my-component',
})
export class MyComponent {
  @Prop() firstName = '';
  @Prop() lastName = '';
  @Prop() vegetarian = false;
  @Prop() favoriteCar = '';

  render() {
    const { form, bind, control, controlBoolean, controlGroup, submit } = reactiveForm({ id: 'user-info' });

    const firstName = bind(this, 'firstName');

    const lastName = control(this.lastName, {
      id: 'last-name',
      debounce: 500,
      onValueChange: (value) => (this.lastName = value),
    });

    const vegetarian = controlBoolean(this.vegetarian, {
      name: 'vegetarian',
      onValueChange: (value) => (this.vegetarian = value),
    });

    const favoriteCar = controlGroup(this.favoriteCar, {
      onValueChange: (value) => (this.favoriteCar = value),
    });

    return (
      <Host>
        <form {...form()}>
          <section>
            <div>
              <label {...labelFor(firstName)}>First Name</label>
            </div>
            <div>
              <p {...descriptionFor(firstName)}>What's your first name?</p>
            </div>
            <div>
              <input {...firstName()} />
            </div>
            <div {...errorFor(firstName)}>
              <div>{validationMessageFor(firstName)}</div>
            </div>
          </section>

          <section>
            <div>
              <label {...labelFor(lastName)}>Last Name</label>
            </div>
            <div>
              <p {...descriptionFor(lastName)}>What's your last name?</p>
            </div>
            <div>
              <input {...input(lastName)} />
            </div>
            <div {...errorFor(firstName)}>
              <div>{validationMessageFor(firstName)}</div>
            </div>
          </section>

          <section>
            <div>
              <label {...labelFor(vegetarian)}>Vegetarian</label>
            </div>
            <div>
              <p {...descriptionFor(vegetarian)}>Are you a vegetarian?</p>
            </div>
            <div>
              <input type="checkbox" {...input(vegetarian)} />
            </div>
            <div {...errorFor(firstName)}>
              <div>{validationMessageFor(firstName)}</div>
            </div>
          </section>

          <section {...input(favoriteCar)}>
            <div>
              <p {...labelFor(favoriteCar)}>Favorite Car</p>
            </div>
            <div>
              <p {...descriptionFor(favoriteCar)}>What's your favorite car?</p>
            </div>
            <div>
              <label {...labelFor(favoriteCar, 'mustang')}>Mustang</label>
              <input type="radio" {...input(favoriteCar, 'mustang')} />
            </div>
            <div>
              <label {...labelFor(favoriteCar, 'camaro')}>Camaro</label>
              <input type="radio" {...input(favoriteCar, 'camaro')} />
            </div>
            <div>
              <label {...labelFor(favoriteCar, 'challenger')}>Challenger</label>
              <input type="radio" {...input(favoriteCar, 'challenger')} />
            </div>
            <div {...errorFor(favoriteCar)}>
              <div>{validationMessageFor(favoriteCar)}</div>
            </div>
          </section>

          <section>
            <button type="reset">Reset</button>
            <button {...submit()}>Submit</button>
          </section>
        </form>
      </Host>
    );
  }
}
