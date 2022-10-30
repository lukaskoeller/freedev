import { Story, Meta } from '@storybook/web-components';
import '../fd-gallery/fd-gallery';
import './fd-gallery-item';
import { html } from 'lit-html';

export default {
  title: 'fd-gallery-item',
  component: 'fd-gallery-item',
} as Meta;

const Template: Story = () => html`
  <fd-gallery>
    ${['1','2','3','4'].map((item) => html`
      <fd-gallery-item
        style="width: var(--size-14); aspect-ratio: 1; background: var(--color-surface-2); display: grid; place-content: center; font-size: var(--size-6); color: var(--color-primary-base); border-radius: var(--radius-3);"
      >${item}</fd-gallery-item>
    `)}
  </fd-gallery>
`;

export const Primary = Template.bind({});
