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
  @Prop() fullName = 'Marty McFly';
  @Prop() email = '';
  @Prop() vegetarian = false;
  @Prop() specialInstructions = '';
  @Prop() favoriteCar = '';

  render() {
    const fullName = bind(this, 'fullName', {
      onBlur: (value) => {
        console.log('firstName onBlur', value);
      },
      onFocus: (value) => {
        console.log('firstName onFocus', value);
      },
    });

    const email = control(this.email, {
      id: 'user-email',
      debounce: 500,
      onValueChange: (value) => (this.email = value),
    });

    const vegetarian = controlBoolean(this.vegetarian, {
      id: 'vegetarian-id',
      name: 'vegetarian-name',
      onValueChange: (value) => (this.vegetarian = value),
    });

    const specialInstructions = bind(this, 'specialInstructions');

    const favoriteCar = controlGroup(this.favoriteCar, {
      id: 'fav-car',
      onValueChange: (value) => (this.favoriteCar = value),
    });

    return (
      <Host>
        <form {...form()}>
          <section>
            <div>
              <label {...labelFor(fullName)}>Name</label>
            </div>
            <div {...descriptionFor(fullName)}>What's your full name? {this.fullName}</div>
            <div>
              <input {...fullName()} />
            </div>
            <div {...validationFor(fullName)}>{validationMessage(fullName)}</div>
          </section>

          <hr />

          <section>
            <div>
              <label {...labelFor(email)}>Last Name</label>
            </div>
            <div {...descriptionFor(email)}>Best email to contact you at? (500ms debounce) {this.email}</div>
            <div>
              <input type="email" required {...email()} />
            </div>
            <div {...validationFor(email)}>{validationMessage(email)}</div>
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

          <section>
            <div>
              <label {...labelFor(specialInstructions)}>Special Instructions</label>
            </div>
            <div {...descriptionFor(specialInstructions)}>
              Do you have dietary restrictions? {this.specialInstructions}
            </div>
            <div>
              <textarea {...specialInstructions()} />
            </div>
            <div {...validationFor(specialInstructions)}>{validationMessage(specialInstructions)}</div>
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
