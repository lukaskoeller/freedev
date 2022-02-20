import { Story, Meta } from '@storybook/web-components';
import './fd-section';
import '../fd-gallery/fd-gallery';
import { html } from 'lit-html';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'fd-section',
  // https://github.com/storybookjs/storybook/blob/88e5774dd94888c4d775695acfd74db824c22346/addons/docs/web-components/README.md
  component: 'fd-section', // which is also found in the `custom-elements.json`
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
} as Meta;

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template: Story = (args) => html`
  <fd-section .heading=${args.heading} .fullWidth=${args.fullWidth}>
    ${args.slot}  
  </fd-section>
`;

/**
 * Some documentation on this story
 */
export const Primary = Template.bind({});
Primary.args = {
  heading: 'About Me',
  slot: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
}

/**
 * With `fullWidth` being true, all `<slot>` children will have no inline padding.
 */
export const FullWidth = Template.bind({});
FullWidth.args = {
  heading: 'About Me',
  fullWidth: true,
  slot: html`
    <fd-gallery style="--fd-gallery-gap: var(--fd-section-padding-inline)">
      <style>
        li {
          display: grid;
          place-content: center;
          inline-size: 40vw;
          aspect-ratio: 16/9;
          background: var(--primary-color-base);
          color: var(--light-color-base);
          border-radius: var(--radius-3);
        }
      </style>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
      </fd-gallery>
  `
}
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args
