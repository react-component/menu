import React from 'react';
import { mount } from 'enzyme';
import { saveRef } from '../src/SubPopupMenu';
import Menu, { MenuItem } from '../src';

describe('SubPopupMenu saveRef', () => {
  let subPopupMenu;


  beforeEach(() => {
    subPopupMenu = { instanceArray: [] };
  });

  it('saveRef should add new component ref', () => {
    saveRef.call(subPopupMenu, { props: { eventKey: '1' } });

    expect(subPopupMenu.instanceArray).toEqual([{ props: { eventKey: '1' } }]);
  });

  it('saveRef should update component ref', () => {
    const c = { props: { eventKey: '1', name: 'old' } };
    subPopupMenu.instanceArray[0] = c;
    saveRef.call(subPopupMenu, c);

    expect(subPopupMenu.instanceArray).toEqual([c]);
  });

  it('activeKey change should reset store activeKey', () => {
    const wrapper = mount(
      <Menu activeKey="1">
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );

    function getItemActive(index) {
      return wrapper.find('MenuItem').at(index).instance().props.active;
    }
    expect(getItemActive(0)).toBe(true);
    expect(getItemActive(1)).toBe(false);

    wrapper.setProps({ activeKey: '2' });

    expect(getItemActive(0)).toBe(false);
    expect(getItemActive(1)).toBe(true);
  });
});
