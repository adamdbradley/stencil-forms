import { Component, h, Host, Prop } from '@stencil/core';
import {
  labelFor,
  labelForGroup,
  descriptionFor,
  checkbox,
  radioGroup,
  radio,
  reactiveForm,
  text,
  errorMessageFor,
  validationMessageFor,
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
    const { form, control, controlGroup, submit } = reactiveForm();

    const firstName = control(this.firstName, {
      onInput: (value) => (this.firstName = value),
    });

    const lastName = control(this.lastName, {
      id: 'last-name',
      onInput: (value) => (this.lastName = value),
    });

    const vegetarian = control(this.vegetarian, {
      name: 'vegetarian',
      onChange: (value) => (this.vegetarian = value),
    });

    const favoriteCar = controlGroup(this.firstName, {
      onChange: (value) => (this.favoriteCar = value),
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
              <input {...text(firstName)} />
            </div>
            <div>
              <div {...errorMessageFor(firstName)}>{validationMessageFor(firstName)}</div>
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
              <input {...text(lastName)} />
            </div>
            <div>
              <div {...errorMessageFor(lastName)}>{validationMessageFor(lastName)}</div>
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
              <input {...checkbox(vegetarian)} />
            </div>
            <div>
              <div {...errorMessageFor(vegetarian)}>{validationMessageFor(vegetarian)}</div>
            </div>
          </section>

          <section {...radioGroup(favoriteCar)}>
            <div>
              <label {...labelForGroup(favoriteCar)}>Favorite Car</label>
            </div>
            <div>
              <p {...descriptionFor(favoriteCar)}>What's your favorite car?</p>
            </div>
            <div>
              <label {...labelFor(favoriteCar, 'mustang')}>Mustang</label>
              <input {...radio(favoriteCar, 'mustang')} />
            </div>
            <div>
              <label {...labelFor(favoriteCar, 'camaro')}>Camaro</label>
              <input {...radio(favoriteCar, 'camaro')} />
            </div>
            <div>
              <label {...labelFor(favoriteCar, 'challenger')}>Challenger</label>
              <input {...radio(favoriteCar, 'challenger')} />
            </div>
            <div>
              <div {...errorMessageFor(vegetarian)}>{validationMessageFor(vegetarian)}</div>
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
