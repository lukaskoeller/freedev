import { Story, Meta } from '@storybook/web-components';
import './fd-input';
import { html } from 'lit-html';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'fd-input',
  // https://github.com/storybookjs/storybook/blob/88e5774dd94888c4d775695acfd74db824c22346/addons/docs/web-components/README.md
  component: 'fd-input', // which is also found in the `custom-elements.json`
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
} as Meta;

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template: Story = (args) => html`
  <form style="display: grid; gap: 16px; justify-items: start;">
    <fd-input
      .value="${args.value}"
      .name="${args.name}"
      .placeholder="${args.placeholder}"
    >
      ${args.slot}
    </fd-input>
    <input name="plant" value="Aloe Vera" />
    <button type="submit">Submit</button>
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

/**
 * Some documentation on this story
 */
export const Primary = Template.bind({});
Primary.args = {
  type: 'text',
  placeholder: 'E.g. Lion',
  name: 'animal',
  value: '',
  slot: 'Animal'
};
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args
