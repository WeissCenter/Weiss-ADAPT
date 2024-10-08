import type { Meta, StoryObj } from '@storybook/angular';
import { AccordionComponent } from './accordion.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<AccordionComponent> = {
  component: AccordionComponent,
  title: 'AccordionComponent',
};
export default meta;
type Story = StoryObj<AccordionComponent>;

export const Primary: Story = {
  args: {
    header: '',
  },
};

export const Heading: Story = {
  args: {
    header: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/accordion works!/gi)).toBeTruthy();
  },
};
