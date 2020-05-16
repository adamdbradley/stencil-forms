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
} from '../../index';

@Component({
  tag: 'my-form',
})
export class MyForm {
  @Prop() firstName = 'Marty';
  @Prop() lastName = 'McFly';
  @Prop() vegetarian = false;
  @Prop() favoriteCar = '';

  render() {
    const firstName = bind(this, 'firstName', {
      onBlur: (value) => {
        console.log('firstName onBlur', value);
      },
      onFocus: (value) => {
        console.log('firstName onFocus', value);
      },
    });

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
            <div {...descriptionFor(firstName)}>What's your first name? {this.firstName}</div>
            <div>
              <input {...firstName()} />
            </div>
            <div {...validationFor(firstName)}>{validationMessage(firstName)}</div>
          </section>

          <hr />

          <section>
            <div>
              <label {...labelFor(lastName)}>Last Name</label>
            </div>
            <div {...descriptionFor(lastName)}>What's your last name? (debounce 500ms) {this.lastName}</div>
            <div>
              <input {...lastName()} />
            </div>
            <div {...validationFor(firstName)}>{validationMessage(lastName)}</div>
          </section>

          <hr />

          <section>
            <div>
              <label {...labelFor(vegetarian)}>Vegetarian</label>
            </div>
            <div {...descriptionFor(vegetarian)}>Are you a vegetarian? {String(this.vegetarian)}</div>
            <div>
              <input type="checkbox" {...vegetarian()} />
            </div>
            <div {...validationFor(vegetarian)}>{validationMessage(vegetarian)}</div>
          </section>

          <hr />

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
            <div {...validationFor(favoriteCar)}>{validationMessage(favoriteCar)}</div>
          </section>

          <hr />

          <section>
            <button type="submit">Submit</button>
          </section>
        </form>
      </Host>
    );
  }
}
