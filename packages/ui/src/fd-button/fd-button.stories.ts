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
  <fd-button>
    Button Label
  </fd-button>
`;
/**
 * Some documentation on this story
 */
export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args
