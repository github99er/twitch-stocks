import { shallow } from 'enzyme';
import * as React from 'react';

import Layout from './../../components/Layout';
import Dashboard from './../../pages/dashboard';

describe('Dashboard Page', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Dashboard />);
  });

  describe('Shallow Render Components', () => {
    let wrapper: any;

    beforeEach(() => {
      wrapper = shallow(<Dashboard />);
    });

    it('contains Layout', () => {
      expect(
        wrapper.find('Layout').at(0).equals(
          <Layout>
            <p>Dashboard Page</p>
          </Layout>,
        ),
      ).toBe(true);
    });
  });
});
