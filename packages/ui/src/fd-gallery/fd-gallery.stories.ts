import { Story, Meta } from '@storybook/web-components';
import './fd-gallery';
import { html } from 'lit-html';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'fd-gallery',
  // https://github.com/storybookjs/storybook/blob/88e5774dd94888c4d775695acfd74db824c22346/addons/docs/web-components/README.md
  component: 'fd-gallery', // which is also found in the `custom-elements.json`
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
} as Meta;

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template: Story = (args) => html`
  <fd-gallery>
    <div>1</div>
    <div>2</div>
    <div>3</div>
  </fd-gallery>
`;
/**
 * Some documentation on this story
 */
export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args

export const GalleryWithLargeBoxes = (args) => html`
  <fd-gallery>
    ${['1','2','3','4'].map((item) => html`
      <div style="width: var(--size-14); aspect-ratio: 1; background: #fcc2d7; display: grid; place-content: center; font-size: var(--size-6); color: #22b8cf;">
        ${item}
      </div>
    `)}
  </fd-gallery>
`
