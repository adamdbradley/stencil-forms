import { Component, h, Host, Prop } from '@stencil/core';
import {
  form,
  bind,
  control,
  controlBoolean,
  controlGroup,
  labelFor,
  descriptionFor,
  validationFor,
  validationMessage,
} from '../reactive-forms';

@Component({
  tag: 'my-component',
})
export class MyComponent {
  @Prop() firstName = '';
  @Prop() lastName = '';
  @Prop() vegetarian = false;
  @Prop() favoriteCar = '';

  render() {
    const firstName = bind(this, 'firstName');

    const lastName = control(this.lastName, {
      id: 'last-name',
      debounce: 500,
      onValueChange: (value) => (this.lastName = value),
    });

    const vegetarian = controlBoolean(this.vegetarian, {
      id: 'vegetarian',
      name: 'vegetarian-name',
      onValueChange: (value) => (this.vegetarian = value),
    });

    const favoriteCar = controlGroup(this.favoriteCar, {
      id: 'fav-car',
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
            <div {...validationFor(firstName)}>
              <div>{validationMessage(firstName)}</div>
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
              <input {...lastName()} />
            </div>
            <div {...validationFor(firstName)}>
              <div>{validationMessage(lastName)}</div>
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
              <input type="checkbox" {...vegetarian()} />
            </div>
            <div {...validationFor(vegetarian)}>
              <div>{validationMessage(vegetarian)}</div>
            </div>
          </section>

          <section {...favoriteCar()}>
            <div>
              <p {...labelFor(favoriteCar)}>Favorite Car</p>
            </div>
            <div>
              <p {...descriptionFor(favoriteCar)}>What's your favorite car?</p>
            </div>
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
            <div {...validationFor(favoriteCar)}>
              <div>{validationMessage(favoriteCar)}</div>
            </div>
          </section>

          <section>
            <button type="submit">Submit</button>
          </section>
        </form>
      </Host>
    );
  }
}
