import { Story, Meta } from "@storybook/web-components";
import "./fd-progress-circle";
import { html } from "lit-html";

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: "fd-progress-circle",
  // https://github.com/storybookjs/storybook/blob/88e5774dd94888c4d775695acfd74db824c22346/addons/docs/web-components/README.md
  component: "fd-progress-circle", // which is also found in the `custom-elements.json`
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
} as Meta;

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template: Story = (args) => html`
  <fd-progress-circle
    progress="${args.progress}"
    totalSteps="${args.totalSteps}"
    variant="${args.variant}"
  />
`;

export const VariantDefault = Template.bind({});
VariantDefault.args = {
  progress: 4,
  totalSteps: 10,
  variant: "default",
};

export const VariantInverted = Template.bind({});
VariantInverted.args = {
  progress: 4,
  totalSteps: 10,
  variant: "inverted",
};
VariantInverted.parameters = {
  backgrounds: {
    default: 'primary',
    values: [
      { name: 'primary', value: 'var(--color-primary-base)' },
    ],
  },
}
