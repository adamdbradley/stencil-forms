import { Component, h, Host, Prop } from '@stencil/core';
import {
  bind,
  bindNumber,
  controlBoolean,
  controlGroup,
  labelFor,
  descriptionFor,
  isValid,
  isInvalid,
  isValidating,
  validationFor,
  validationMessage,
} from '../../index';
import { controlNumber } from '../../control';

@Component({
  tag: 'my-form',
  styles: `
    form button {
      cursor: pointer;
      background: #ccc;
      margin: 10px 0 0 0;
    }
    form:invalid button {
      pointer-events: none;
      opacity: 0.4;
    }
    input:valid {
      border: 1px solid green;
    }
    input:invalid {
      border: 1px solid red;
    }
    .is-validating {
      background: #eee;
      border: 1px solid yellow;
    }
    .is-valid {
      border: 1px solid green;
    }
    .is-invalid {
      border: 1px solid red;
    }
  `,
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

  onSubmit = (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();

    const formData = new FormData(ev.currentTarget as HTMLFormElement);
    const jsonData = JSON.stringify(Object.fromEntries(formData as any), null, 2);
    console.warn('submit', jsonData);
  };

  render() {
    const fullName = bind(this, 'fullName');

    const email = bind(this, 'email');

    const userName = bind(this, 'userName', {
      debounce: 500,
      validatingMessage: (value) => `Checking if "${value}" is already taken...`,
      validate: (value) => {
        console.log(`checking "${value}" username...`);
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(`finished checking "${value}" username`);
            resolve();
          }, 5000);
        });
      },
    });

    const age = bindNumber(this, 'age', {
      validate: (value) => {
        if (value < 18) {
          return 'Must be 18 or older';
        }
      },
    });

    const volume = controlNumber(this.volume, {
      onValueChange: (value) => (this.volume = value),
    });

    const vegetarian = controlBoolean(this.vegetarian, {
      onValueChange: (value) => (this.vegetarian = value),
    });

    const specialInstructions = bind(this, 'specialInstructions');

    const favoriteCar = controlGroup(this.favoriteCar, {
      onValueChange: (value) => (this.favoriteCar = value),
    });

    return (
      <Host>
        <form onSubmit={this.onSubmit}>
          {/* <section>
            <div>
              <label {...labelFor(fullName)}>Name</label>
            </div>
            <div {...descriptionFor(fullName)}>What's your full name? {this.fullName}</div>
            <div>
              <input {...fullName()} />
            </div>
            <span {...validationFor(fullName)}>{validationMessage(fullName)}</span>
          </section> 
          <hr />
          <section>
            <div>
              <label {...labelFor(email)}>Email</label>
            </div>
            <div {...descriptionFor(email)}>Best email to contact you at? {this.email}</div>
            <div>
              <input id="my-email-id" name="my-email-name" type="email" required {...email()} />
            </div>
            <div {...validationFor(email)}>{validationMessage(email)}</div>
          </section>
          <hr />*/}

          <section
            class={{
              'is-validating': isValidating(userName),
              'is-valid': isValid(userName),
              'is-invalid': isInvalid(userName),
            }}
          >
            <div>
              <label {...labelFor(userName)}>User Name</label>
            </div>
            <div {...descriptionFor(userName)}>Enter a unique username? (500ms debounce) {this.userName}</div>
            <div>
              <input required {...userName()} />
            </div>
            <div {...validationFor(userName)}>{validationMessage(userName)}</div>
          </section>

          {/* 
          <section>
            <div>
              <label {...labelFor(age)}>Age</label>
            </div>
            <div {...descriptionFor(age)}>How many years young are you? {this.age}</div>
            <div>
              <input type="number" min="0" max="150" {...age()} />
            </div>
            <div {...validationFor(age)}>{validationMessage(age)}</div>
          </section>

          <hr />

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
          <hr /> */}
          <section>
            <button type="submit">Submit</button>
          </section>
        </form>
      </Host>
    );
  }
}
