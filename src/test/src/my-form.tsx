import { Component, h, Host, Prop, State } from '@stencil/core';
import {
  bind,
  bindBoolean,
  controlBoolean,
  control,
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
  submitValidity,
} from '../../index';

@Component({
  tag: 'my-form',
  styleUrl: 'my-form.css',
})
export class MyForm {
  @Prop() login = false;
  @Prop() fullName = 'Marty McFly';
  @Prop() email = '';
  @Prop() userName = '';
  @Prop() age = 17;
  @Prop() volume = 11;
  @Prop() vegetarian = false;
  @Prop() busy = true;
  @Prop() specialInstructions = '';
  @Prop() favoriteCar = '';
  @Prop() carBodyStyle = '';
  @Prop() hoodScoop = false;
  @Prop() counter = 0;
  @State() json = '';

  componentWillLoad() {
    const search = new URLSearchParams(document.location.search);
    if (search.get('token') === 'test') {
      this.login = true;
    }
  }
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
      activelyValidatingMessage: ({ value }) => `Checking if "${value}" is already taken...`,
      validate: ({ value }) => {
        console.log(`async checking "${value}" username, this will take 3 seconds...`);
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(`finished checking "${value}" username`);
            resolve();
          }, 3000);
        });
      },
      onCommit({ value }) {
        console.log(`userName commit: ${value}`);
      },
    });

    const validateAge = (event: { value: number }) => {
      if (event.value < 18) {
        return `Must be 18 or older, but you entered ${event.value}`;
      }
    };

    const age = bind(this, 'age', {
      validate: validateAge,
      onCommit({ value }) {
        console.log(`age commit: ${value}`);
      },
    });

    const volume = control(this.volume, {
      onValueChange: ({ value }) => {
        this.volume = value;
      },
      onCommit({ value }) {
        console.log(`volume commit: ${value}`);
      },
    });

    const vegetarian = controlBoolean(this.vegetarian, {
      onValueChange: ({ value }) => (this.vegetarian = !!value),
      onCommit({ value }) {
        console.log(`vegetarian commit: ${value}`);
      },
    });

    const busy = bindBoolean(this, 'busy', {
      onCommit({ value }) {
        console.log(`busy commit: ${value}`);
      },
    });

    const specialInstructions = bind(this, 'specialInstructions', {
      onKeyDown: ({ key, value }) => {
        console.log('onKeyDown, key', key, 'value', value);
      },
      onKeyUp: ({ key, value }) => {
        console.log('onKeyUp, key', key, 'value', value);
      },
      onCommit({ value }) {
        console.log(`special instructions commit: ${value}`);
      },
    });

    const favoriteCar = controlGroup(this.favoriteCar, {
      onValueChange: ({ value }) => (this.favoriteCar = value),
      onCommit({ value }) {
        console.log(`favorite car commit: ${value}`);
      },
    });

    const carBodyStyle = bind(this, 'carBodyStyle', {
      validate({ value }) {
        if (!value) {
          return 'Select a body style';
        }
      },
      onCommit({ value }) {
        console.log(`car body style commit: ${value}`);
      },
    });

    const hoodScoop = bind(this, 'hoodScoop', {
      onCommit({ value }) {
        console.log(`hood scoop commit: ${value}`);
      },
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
              <label {...labelFor(busy)}>Busy: {String(this.busy)}</label>
            </div>
            <div>
              <input type="checkbox" {...busy()} />
            </div>
          </section>
          <section>
            <div>
              <label {...labelFor(specialInstructions)}>Special Instructions</label>
            </div>
            <div {...descriptionFor(specialInstructions)}>
              (Uses the browser's default error popup message, rather than using a custom validationFor() method.)
            </div>
            <div>
              <textarea required {...specialInstructions()} />
            </div>
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
            <label {...labelFor(carBodyStyle)}>Car Body Style: {this.carBodyStyle}</label>
            <div>
              <select {...carBodyStyle()}>
                <option></option>
                <option value="fastback">Fastback</option>
                <option value="coupe">Coupe</option>
                <option value="convertible">Convertible</option>
              </select>
              <div {...validationFor(carBodyStyle)}>{validationMessage(carBodyStyle)}</div>
            </div>
          </section>
          <section>
            <label {...labelFor(hoodScoop)}>Hood Scoop: {String(this.hoodScoop)}</label>
            <div>
              <select {...hoodScoop()}>
                <option selected={this.hoodScoop}>true</option>
                <option selected={!this.hoodScoop}>false</option>
              </select>
            </div>
          </section>
          <section>
            <button type="submit" {...submitValidity(!this.login ? 'Bad auth. Add ?token=test' : undefined)}>
              Submit
            </button>
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
