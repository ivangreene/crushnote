import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai'
import Card from '../client/src/components/Card/Card.js';

const wrapper = shallow(<Card/>);

describe('(Component) Card', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
