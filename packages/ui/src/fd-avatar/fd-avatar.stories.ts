import { Story, Meta } from '@storybook/web-components';
import './fd-avatar';
import { html } from 'lit-html';
import { Sizes } from 'types';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'fd-avatar',
  // https://github.com/storybookjs/storybook/blob/88e5774dd94888c4d775695acfd74db824c22346/addons/docs/web-components/README.md
  component: 'fd-avatar', // which is also found in the `custom-elements.json`
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
} as Meta;

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template: Story = (args) => html`
  <fd-avatar .name="${args.name}" .size="${args.size}">
    ${args?.slot}
  </fd-avatar>
`;

export const Primary = Template.bind({});
Primary.args = {
  name: 'Lukas Koeller',
}

export const WithImage: Story = (args) => html`
  ${Object.values(Sizes).map((size) => (
    html`
      <fd-avatar .name="${args.name}" .size="${size}">
        ${args?.slot}
      </fd-avatar>
    `
  ))}
`;
WithImage.args = {
  name: 'Lukas Koeller',
  slot: html`
    <img
      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300"
    />
  `,
}

export const AllSizes: Story = (args) => html`
  ${Object.values(Sizes).map((size) => (
    html`
      <fd-avatar .name="${args.name}" .size="${size}"></fd-avatar>
    `
  ))}
`;
AllSizes.args = {
  name: 'Lukas Koeller',
}
