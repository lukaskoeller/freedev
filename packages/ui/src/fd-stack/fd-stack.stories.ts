import { Story, Meta } from '@storybook/web-components';
import './fd-stack';
import { html } from 'lit-html';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'fd-stack',
  // https://github.com/storybookjs/storybook/blob/88e5774dd94888c4d775695acfd74db824c22346/addons/docs/web-components/README.md
  component: 'fd-stack', // which is also found in the `custom-elements.json`
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
} as Meta;

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template: Story = (args) => html`
  <h1>Vertical Stack</h1>
  <fd-stack>
    ${args.slot}
  <fd-stack>
`;

/**
 * Some documentation on this story
 */
export const Primary = Template.bind({});
Primary.args = {
  slot: html`
    <style>
      h2 {
        background-color: var(--primary-color-1);
        padding: var(--size-3);
        border-radius: var(--radius-2);
      }
    </style>
    <h2>1</h2>
    <h2>2</h2>
    <h2>3</h2>
    <h2>4</h2>
  `,
};
