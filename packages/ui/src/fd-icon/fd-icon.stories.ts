import { Story, Meta } from '@storybook/web-components';
import './fd-icon';
import '../fd-gallery/fd-gallery';
import { html } from 'lit-html';
import svgBell from 'assets/icons/bell-solid.svg?raw';
import { Sizes } from 'types/index';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'fd-icon',
  // https://github.com/storybookjs/storybook/blob/88e5774dd94888c4d775695acfd74db824c22346/addons/docs/web-components/README.md
  component: 'fd-icon', // which is also found in the `custom-elements.json`
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
} as Meta;

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template: Story = (args) => html`
  <fd-icon .file=${args.file} .size=${args.size} />
`;

/**
 * Some documentation on this story
 */
export const Primary = Template.bind({});
Primary.args = {
  file: svgBell,
  size: Sizes.Xl,
}

export const AllSizes: Story = (args) => html`
  ${Object.values(Sizes).map((size) => (
    html`
      <fd-icon .file=${args.file} .size=${size} />
    `
  ))}
`;
AllSizes.args = {
  file: svgBell
}
