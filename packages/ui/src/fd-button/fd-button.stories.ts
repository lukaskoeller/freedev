import { Story, Meta } from '@storybook/web-components';
import './fd-button';
import { html } from 'lit-html';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'fd-button',
  // https://github.com/storybookjs/storybook/blob/88e5774dd94888c4d775695acfd74db824c22346/addons/docs/web-components/README.md
  component: 'fd-button', // which is also found in the `custom-elements.json`
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
} as Meta;

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template: Story = (args) => html`
  <fd-button
    .variant="${args.variant}"
    .size="${args.size}"
    .href="${args.href}"
  >
    ${args.slot}
  </fd-button>
`;

/**
 * Some documentation on this story
 */
export const VariantPrimary = Template.bind({});
VariantPrimary.args = {
  slot: 'Button Label',
};

export const VariantLight = Template.bind({});
VariantLight.args = {
  variant: "light",
  slot: 'Button Label',
}
export const VariantStealth = Template.bind({});
VariantStealth.args = {
  variant: "stealth",
  slot: 'Button Label',
}

export const SizeSm = Template.bind({});
SizeSm.args = {
  size: "sm",
  slot: 'Button Label',
}

export const WithHref = Template.bind({});
WithHref.args = {
  href: 'https://www.youtube.com/watch?v=Cz23Cw-Z6SE',
  slot: 'Button Label',
}

export const Expand: Story = (args) => html`
  <fd-button
    expand
    .size="${args.size}"
    href="https://www.youtube.com/watch?v=Cz23Cw-Z6SE"
  >
    ${args.slot}
  </fd-button>
  <fd-button
    expand
    .size="${args.size}"
  >
    ${args.slot}
  </fd-button>
`;
Expand.args = {
  slot: 'Button Label',
}

export const Submit: Story = (args) => html`
  <form>
    <input value="test value" name="test" />
    <fd-button
      .type=${args.type}
      .variant="${args.variant}"
      .size="${args.size}"
      .href="${args.href}"
    >
      ${args.proxy}
      ${args.slot}
    </fd-button>
  </form>
  <output></output>
  <script>
    const form = document.querySelector('form');
    const output = document.querySelector('output');

    form.addEventListener('submit', event => {
      event.preventDefault();
      
      const form = event.target;

      /** Get all of the form data */
      const formData = new FormData(form);
      const data = [...formData.entries()];
      data.forEach((value, key) => data[key] = value);
      console.log(data);
      output.innerHTML = JSON.stringify(data, null, 2);
    });
  </script>
`;
Submit.args = {
  type: 'submit',
  slot: 'Button Label',
}
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args
