const mockedUtil = require('../src/util');

/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, MenuItemGroup, SubMenu, Divider } from '../src';

describe('Menu', () => {
  describe('render', () => {
    function createMenu(props) {
      return (
        <Menu
          className="myMenu"
          openAnimation="fade"
          {...props}
        >
          <MenuItemGroup title="g1">
            <MenuItem key="1">1</MenuItem>
            <Divider/>
            <MenuItem key="2">2</MenuItem>
          </MenuItemGroup>
          <MenuItem key="3">3</MenuItem>
          <MenuItemGroup title="g2">
            <MenuItem key="4">4</MenuItem>
            <MenuItem key="5" disabled>5</MenuItem>
          </MenuItemGroup>
          <SubMenu title="submenu">
            <MenuItem key="6">6</MenuItem>
          </SubMenu>
        </Menu>
      );
    }

    ['vertical', 'horizontal', 'inline'].forEach((mode) => {
      it(`renders ${mode} menu correctly`, () => {
        const wrapper = render(createMenu({ mode }));
        expect(renderToJson(wrapper)).toMatchSnapshot();
      });
    });
  });

  describe('render role listbox', () => {
    function createMenu() {
      return (
        <Menu
          className="myMenu"
          openAnimation="fade"
          role="listbox"
        >
          <MenuItem key="1" role="option">1</MenuItem>
          <MenuItem key="2" role="option">2</MenuItem>
          <MenuItem key="3" role="option">3</MenuItem>
        </Menu>
      );
    }

    it(`renders menu correctly`, () => {
      const wrapper = render(createMenu());
      expect(renderToJson(wrapper)).toMatchSnapshot();
    });
  });

  it('set activeKey', () => {
    const wrapper = mount(
      <Menu activeKey="1">
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    expect(wrapper.find('MenuItem').first().props().active).toBe(true);
    expect(wrapper.find('MenuItem').last().props().active).toBe(false);
  });

  it('active first item', () => {
    const wrapper = mount(
      <Menu defaultActiveFirst>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    expect(wrapper.find('MenuItem').first().props().active).toBe(true);
  });

  it('select multiple items', () => {
    const wrapper = mount(
      <Menu multiple>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    wrapper.find('MenuItem').first().simulate('click');
    wrapper.find('MenuItem').last().simulate('click');

    expect(wrapper.find('.rc-menu-item-selected').length).toBe(2);
  });

  it('can be controlled by selectedKeys', () => {
    const wrapper = mount(
      <Menu selectedKeys={['1']}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    expect(wrapper.find('li').first().props().className).toContain('-selected');
    wrapper.setProps({ selectedKeys: ['2'] });
    wrapper.update();
    expect(wrapper.find('li').last().props().className).toContain('-selected');
  });

  it('select default item', () => {
    const wrapper = mount(
      <Menu defaultSelectedKeys={['1']}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    expect(wrapper.find('li').first().props().className).toContain('-selected');
  });

  it('can be controlled by openKeys', () => {
    const wrapper = mount(
      <Menu openKeys={['g1']}>
        <MenuItemGroup key="g1">
          <MenuItem key="1">1</MenuItem>
        </MenuItemGroup>
        <MenuItemGroup key="g2">
          <MenuItem key="2">2</MenuItem>
        </MenuItemGroup>
      </Menu>
    );
    expect(wrapper.find('ul').first().props().className).not.toContain('-hidden');
    wrapper.setProps({ openKeys: ['g2'] });
    expect(wrapper.find('ul').last().props().className).not.toContain('-hidden');
  });

  it('open default submenu', () => {
    const wrapper = mount(
      <Menu defaultOpenKeys={['g1']}>
        <MenuItemGroup key="g1">
          <MenuItem key="1">1</MenuItem>
        </MenuItemGroup>
        <MenuItemGroup key="g2">
          <MenuItem key="2">2</MenuItem>
        </MenuItemGroup>
      </Menu>
    );
    expect(wrapper.find('ul').first().props().className).not.toContain('-hidden');
  });

  it('fires select event', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Menu onSelect={handleSelect}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    wrapper.find('MenuItem').first().simulate('click');
    expect(handleSelect.mock.calls[0][0].key).toBe('1');
  });

  it('fires click event', () => {
    const handleClick = jest.fn();
    const wrapper = mount(
      <Menu onClick={handleClick}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    wrapper.find('MenuItem').first().simulate('click');
    expect(handleClick.mock.calls[0][0].key).toBe('1');
  });

  it('fires deselect event', () => {
    const handleDeselect = jest.fn();
    const wrapper = mount(
      <Menu multiple onDeselect={handleDeselect}>
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );
    wrapper.find('MenuItem').first().simulate('click').simulate('click');
    expect(handleDeselect.mock.calls[0][0].key).toBe('1');
  });

  it('active by mouse enter', () => {
    const wrapper = mount(
      <Menu>
        <MenuItem key="item1">item</MenuItem>
        <MenuItem disabled>disabled</MenuItem>
        <MenuItem key="item2">item2</MenuItem>
      </Menu>
    );
    let menuItem = wrapper.find('MenuItem').last();
    menuItem.simulate('mouseEnter');
    menuItem = wrapper.find('MenuItem').last();
    expect(menuItem.props().active).toBe(true);
  });

  it('active by key down', () => {
    const wrapper = mount(
      <Menu activeKey="1">
        <MenuItem key="1">1</MenuItem>
        <MenuItem key="2">2</MenuItem>
      </Menu>
    );

    wrapper.simulate('keyDown', { keyCode: KeyCode.DOWN });
    expect(wrapper.find('MenuItem').at(1).props().active).toBe(true);
  });

  it('keydown works when children change', () => {
    class App extends React.Component {
      state = {
        items: [1, 2, 3],
      }

      render() {
        return (
          <Menu>
            {this.state.items.map(i =>
              <MenuItem key={i}>{i}</MenuItem>
            )}
          </Menu>
        );
      }
    }

    const wrapper = mount(<App />);

    wrapper.setState({ items: [0, 1] });

    wrapper.find('Menu').simulate('keyDown', { keyCode: KeyCode.DOWN });
    expect(wrapper.find('MenuItem').at(0).props().active).toBe(true);

    wrapper.find('Menu').simulate('keyDown', { keyCode: KeyCode.DOWN });
    expect(wrapper.find('MenuItem').at(1).props().active).toBe(true);
  });

  it('active first item when children changes', () => {
    class App extends React.Component {
      state = {
        items: ['foo'],
      }

      render() {
        return (
          <Menu defaultActiveFirst activeKey="" selectedKeys={['foo']}>
            {this.state.items.map(item =>
              <MenuItem key={item}>{item}</MenuItem>
            )}
          </Menu>
        );
      }
    }

    const wrapper = mount(<App />);

    wrapper.setState({ items: ['bar', 'foo'] });
    wrapper.update();

    expect(
      wrapper.find('li').first().hasClass('rc-menu-item-active')
    ).toBe(true);
  });

  it('should accept builtinPlacements', () => {
    const builtinPlacements = {
      leftTop: {
        points: ['tr', 'tl'],
        overflow: {
          adjustX: 0,
          adjustY: 0,
        },
        offset: [0, 0],
      },
    };

    const wrapper = mount(
      <Menu builtinPlacements={builtinPlacements}>
        <MenuItem>menuItem</MenuItem>
        <SubMenu title="submenu">
          <MenuItem>menuItem</MenuItem>
        </SubMenu>
      </Menu>
    );

    expect(wrapper.find('Trigger').prop('builtinPlacements').leftTop)
      .toEqual(builtinPlacements.leftTop);
  });

  describe('DOMWrap Allow Overflow', () => {
    function createMenu(props) {
      return (
        <Menu
          mode="horizontal"
          className="myMenu"
          openAnimation="fade"
          overflowedIndicator={<div className="test-overflow-indicator">...</div>}
          {...props}
        >
          <MenuItem key="1">1</MenuItem>
          <MenuItem key="2" disabled>2</MenuItem>
          <SubMenu title="submenu">
            <MenuItem key="3">3</MenuItem>
          </SubMenu>
          <MenuItem key="4">4</MenuItem>
        </Menu>
      );
    }

    let wrapper;

    it('should not include overflow indicator when having enough width', () => {
      const scrollWidth = 200;
      const indicatorWidth = 10; // actual width including 40 px padding, which will be 50;
      const liWidths = [50, 50, 50, 50];
      const availableWidth = 250;
      const widths = [...liWidths, indicatorWidth, availableWidth];
      let i = 0;
      mockedUtil.getWidth = () => {
        return widths[i++];
      };
      mockedUtil.getScrollWidth = () => {
        return scrollWidth;
      };
      wrapper = mount(createMenu());

      expect(wrapper.find('.test-overflow-indicator').length).toEqual(0);
      expect(wrapper.find('MenuItem').length).toEqual(3);
    });

    it('should include overflow indicator when having not enough width', () => {
      const scrollWidth = 200;
      const indicatorWidth = 5; // actual width including 40 px padding, which will be 45;
      const liWidths = [50, 50, 50, 50];
      const availableWidth = 145;
      const widths = [...liWidths, indicatorWidth, availableWidth];
      let i = 0;
      mockedUtil.getWidth = () => {
        return widths[i++];
      };
      mockedUtil.getScrollWidth = () => {
        return scrollWidth;
      };
      wrapper = mount(createMenu());

      expect(wrapper.find('.test-overflow-indicator').length).toEqual(1);
      expect(wrapper.find('MenuItem').length).toEqual(3);
      expect(wrapper.find('MenuItem').at(2).prop('style').visibility).toEqual('hidden');
      expect(wrapper.find('MenuItem').at(0).prop('children')).toEqual('1');
    });

    it('should not reuse last item for displaying overflow indicator', () => {
      const scrollWidth = 200;
      const indicatorWidth = 10; // actual width including 40 px padding, which will be 50;
      const liWidths = [50, 50, 50, 50];
      const availableWidth = 170;
      const widths = [...liWidths, indicatorWidth, availableWidth];
      let i = 0;
      mockedUtil.getWidth = () => {
        return widths[i++];
      };
      mockedUtil.getScrollWidth = () => {
        return scrollWidth;
      };
      wrapper = mount(createMenu());

      expect(wrapper.find('.test-overflow-indicator').length).toEqual(1);

      expect(wrapper.find('ul.rc-menu').childAt(2).prop('className'))
        .toEqual('rc-menu-overflowed-submenu');
    });

    it('should reuse last item for displaying overflow indicator', () => {
      const scrollWidth = 200;
      const indicatorWidth = 5; // actual width including 40 px padding, which will be 50;
      const liWidths = [50, 50, 50, 50];
      const availableWidth = 145;
      const widths = [...liWidths, indicatorWidth, availableWidth];
      let i = 0;
      mockedUtil.getWidth = () => {
        return widths[i++];
      };
      mockedUtil.getScrollWidth = () => {
        return scrollWidth;
      };
      wrapper = mount(createMenu());

      expect(wrapper.find('.test-overflow-indicator').length).toEqual(1);

      expect(wrapper.find('ul.rc-menu').childAt(2).prop('className'))
        .toEqual('rc-menu-overflowed-submenu');
    });

    describe('props changes', () => {
      it('should recalculate overflow on children changes', () => {
        const scrollWidth = 200;
        const liWidths = [50, 50, 50, 50];
        const availableWidth = 145;
        const indicatorWidth = 5; // actual width including 40 px padding, which will be 45;
        const widths = [...liWidths, indicatorWidth, availableWidth];
        let i = 0;

        mockedUtil.getWidth = () => {
          return widths[i++];
        };
        mockedUtil.getScrollWidth = () => {
          return scrollWidth;
        };

        wrapper = mount(createMenu());
        wrapper.setProps({ children: <MenuItem>child</MenuItem> });
        wrapper.update();

        expect(wrapper.find('.test-overflow-indicator').length).toEqual(0);
      });

      it('should recalculate overflow on overflow indicator changes', () => {
        const scrollWidth = 200;
        const liWidths = [50, 50, 50, 50];
        const availableWidth = 145;
        let indicatorWidth = 5; // actual width including 40 px padding, which will be 45;
        let widths = [...liWidths, indicatorWidth, availableWidth];
        let i = 0;

        mockedUtil.getWidth = () => {
          return widths[i++];
        };
        mockedUtil.getScrollWidth = () => {
          return scrollWidth;
        };

        wrapper = mount(createMenu());

        expect(wrapper.find('ul.rc-menu').childAt(2).prop('className'))
          .toEqual('rc-menu-overflowed-submenu');

        indicatorWidth = 20; // actual width including 40 px padding, which will be 60;
        widths = [...liWidths, indicatorWidth, availableWidth];

        i = 0;
        wrapper.setProps({ overflowedIndicator: <span>add more</span> });
        wrapper.update();

        expect(wrapper.find('ul.rc-menu').childAt(1).prop('className'))
          .toEqual('rc-menu-overflowed-submenu');
      });
    });
  });
});
