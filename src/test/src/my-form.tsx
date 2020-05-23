import { Component, h, Host, Prop, State } from '@stencil/core';
import {
  bind,
  bindNumber,
  controlBoolean,
  controlNumber,
  controlGroup,
  labelFor,
  descriptionFor,
  isValid,
  isInvalid,
  isActivelyValidating,
  activelyValidatingMessage,
  isDirty,
  isTouched,
  validationFor,
  validationMessage,
} from '../../index';

@Component({
  tag: 'my-form',
  styleUrl: 'my-form.css',
})
export class MyForm {
  @Prop() fullName = 'Marty McFly';
  @Prop() email = '';
  @Prop() userName = '';
  @Prop() age = 17;
  @Prop() volume = 11;
  @Prop() vegetarian = false;
  @Prop() specialInstructions = '';
  @Prop() favoriteCar = '';
  @Prop() counter = 0;
  @State() json = '';

  onSubmit = (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();

    const formData = new FormData(ev.currentTarget as HTMLFormElement);
    this.json = JSON.stringify(Object.fromEntries(formData as any), null, 2);
    console.warn('submit', this.json);
  };

  render() {
    const fullName = bind(this, 'fullName');

    const email = bind(this, 'email');

    const userName = bind(this, 'userName', {
      debounce: 500,
      activelyValidatingMessage: (value) => `Checking if "${value}" is already taken...`,
      validate: (value) => {
        console.log(`async checking "${value}" username, this will take 3 seconds...`);
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(`finished checking "${value}" username`);
            resolve();
          }, 3000);
        });
      },
    });

    const age = bindNumber(this, 'age', {
      validate: (value) => {
        if (value < 18) {
          return `Must be 18 or older, but you entered ${value}`;
        }
      },
    });

    const volume = controlNumber(this.volume, {
      onValueChange: (value) => (this.volume = value),
    });

    const vegetarian = controlBoolean(this.vegetarian, {
      onValueChange: (value) => (this.vegetarian = value),
    });

    const specialInstructions = bind(this, 'specialInstructions', {
      onKeyDown: (key, value) => {
        console.log('key', key, 'value', value);
      },
    });

    const favoriteCar = controlGroup(this.favoriteCar, {
      onValueChange: (value) => (this.favoriteCar = value),
    });

    return (
      <Host>
        <form onSubmit={this.onSubmit}>
          <section>
            <div>
              <label {...labelFor(fullName)}>Name</label>
            </div>
            <div {...descriptionFor(fullName)}>What's your full name? {this.fullName}</div>
            <div>
              <input required {...fullName()} />
            </div>
            <span {...validationFor(fullName)}>{validationMessage(fullName)}</span>
          </section>

          <section>
            <div>
              <label {...labelFor(email)}>Email</label>
            </div>
            <div
              class={{
                'is-dirty': isDirty(email),
              }}
              {...descriptionFor(email)}
            >
              (Purple means the input is "dirty" because the value has changed)
            </div>
            <div>
              <input id="my-email-id" name="my-email-name" type="email" required {...email()} />
            </div>
            <div {...validationFor(email)}>{validationMessage(email)}</div>
          </section>

          <section>
            <div>
              <label {...labelFor(age)}>Age</label>
            </div>
            <div
              class={{
                'is-touched': isTouched(age),
              }}
              {...descriptionFor(age)}
            >
              (Blue means it's "touched" because the blur event happened)
            </div>
            <div>
              <input type="number" min="0" max="150" {...age()} />
            </div>
            <div {...validationFor(age)}>{validationMessage(age)}</div>
          </section>

          <section
            class={{
              'is-validating': isActivelyValidating(userName),
              'is-valid': isValid(userName),
              'is-invalid': isInvalid(userName),
            }}
          >
            <div>
              <label {...labelFor(userName)}>User Name</label>
            </div>
            <div {...descriptionFor(userName)}>(500ms debounce, 3s async validation)</div>
            <div>
              <input required {...userName()} />
            </div>
            <div class="actively-validating" hidden={!isActivelyValidating(userName)}>
              {activelyValidatingMessage(userName)}
            </div>
            <div {...validationFor(userName)}>{validationMessage(userName)}</div>
          </section>

          <section>
            <div>
              <label {...labelFor(volume)}>Volume</label>
            </div>
            <div {...descriptionFor(age)}>These go to eleven: {this.volume}</div>
            <div>
              <input type="range" min="0" max="11" {...volume()} />
            </div>
            <div {...validationFor(volume)}>{validationMessage(volume)}</div>
          </section>

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

          <section {...favoriteCar()}>
            <div class="group-label" {...labelFor(favoriteCar)}>
              Favorite Car
            </div>
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

          <section>
            <button type="submit">Submit</button>
          </section>
        </form>

        {this.json !== '' ? <pre>Form Submit {this.json}</pre> : null}

        <section class="counter">
          Counter (just to test re-rendering scenarios):
          <button onClick={() => this.counter--}>-</button> {this.counter}{' '}
          <button onClick={() => this.counter++}>+</button>
        </section>
      </Host>
    );
  }
}
