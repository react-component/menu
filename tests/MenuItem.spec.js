/* eslint-disable no-undef */
import { fireEvent, render } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import Menu, { MenuItem, MenuItemGroup, SubMenu } from '../src';

describe('MenuItem', () => {
  const subMenuIconText = 'SubMenuIcon';
  const menuItemIconText = 'MenuItemIcon';
  function itemIcon() {
    return <span>{menuItemIconText}</span>;
  }

  function expandIcon() {
    return <span>{subMenuIconText}</span>;
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('custom icon', () => {
    it('should render custom arrow icon correctly.', () => {
      const { container } = render(
        <Menu mode="vertical" itemIcon={itemIcon} expandIcon={expandIcon}>
          <MenuItem key="1">1</MenuItem>
        </Menu>,
      );
      const menuItemText = container.querySelector('.rc-menu-item').textContent;
      expect(menuItemText).toEqual(`1${menuItemIconText}`);
    });

    it('should render custom arrow icon correctly (with children props).', () => {
      const targetText = 'target';
      const { container } = render(
        <Menu mode="vertical" itemIcon={itemIcon} expandIcon={expandIcon}>
          <MenuItem key="1" itemIcon={() => <span>{targetText}</span>}>
            1
          </MenuItem>
          <MenuItem key="2">2</MenuItem>
        </Menu>,
      );
      const menuItemText = container.querySelector('.rc-menu-item').textContent;
      expect(menuItemText).toEqual(`1${targetText}`);
    });
  });

  it('not fires select event when disabled', () => {
    const handleSelect = jest.fn();
    const { container } = render(
      <Menu>
        <MenuItem disabled onSelect={handleSelect}>
          <span className="xx">Item content</span>
        </MenuItem>
      </Menu>,
    );

    fireEvent.click(container.querySelector('.xx'));
    expect(handleSelect).not.toBeCalled();
  });

  describe('menuItem events', () => {
    function renderMenu(props, itemProps) {
      return render(
        <Menu {...props}>
          <MenuItem key="light" {...itemProps} />
        </Menu>,
      );
    }

    it('on enter key down should trigger onClick', () => {
      const onItemClick = jest.fn();
      const { container } = renderMenu(null, { onClick: onItemClick });
      fireEvent.keyDown(container.querySelector('.rc-menu-item'), {
        which: KeyCode.ENTER,
        keyCode: KeyCode.ENTER,
      });
      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ domEvent: expect.anything() }),
      );
    });

    it('on mouse enter should trigger onMouseEnter', () => {
      const onItemMouseEnter = jest.fn();
      const { container } = renderMenu(null, {
        onMouseEnter: onItemMouseEnter,
      });
      fireEvent.mouseEnter(container.querySelector('.rc-menu-item'));
      expect(onItemMouseEnter).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'light', domEvent: expect.anything() }),
      );
    });

    it('on mouse leave should trigger onMouseLeave', () => {
      const onItemMouseLeave = jest.fn();
      const { container } = renderMenu(null, {
        onMouseLeave: onItemMouseLeave,
      });
      fireEvent.mouseLeave(container.querySelector('.rc-menu-item'));
      expect(onItemMouseLeave).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'light', domEvent: expect.anything() }),
      );
    });
  });

  describe('rest props', () => {
    it('onClick event should only trigger 1 time along the component hierarchy', () => {
      const onClick = jest.fn();
      const restProps = {
        onClick,
        'data-whatever': 'whatever',
        title: 'title',
        className: 'className',
        style: { fontSize: 20 },
      };

      const { container } = render(
        <Menu mode="inline" activeKey="1" openKeys={['bamboo']}>
          <MenuItem key="1" {...restProps}>
            1
          </MenuItem>
          <SubMenu key="bamboo" {...restProps}>
            <MenuItem key="2" {...restProps}>
              3
            </MenuItem>
          </SubMenu>
          <MenuItemGroup {...restProps}>
            <MenuItem key="3" {...restProps}>
              4
            </MenuItem>
          </MenuItemGroup>
        </Menu>,
      );

      expect(container.children).toMatchSnapshot();

      fireEvent.click(container.querySelector('.rc-menu-item'));
      expect(onClick).toHaveBeenCalledTimes(1);

      fireEvent.click(container.querySelector('.rc-menu-sub'));
      expect(onClick).toHaveBeenCalledTimes(1);

      fireEvent.click(container.querySelector('.rc-menu-item-group'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('overwrite default role', () => {
    it('should set role to none if null', () => {
      const { container } = render(
        <Menu>
          <MenuItem role={null}>test</MenuItem>
        </Menu>,
      );

      expect(container.querySelector('li')).toMatchSnapshot();
    });

    it('should set role to none if none', () => {
      const { container } = render(
        <Menu>
          <MenuItem role="none">test</MenuItem>
        </Menu>,
      );

      expect(container.querySelector('li')).toMatchSnapshot();
    });

    it('should set role to listitem', () => {
      const { container } = render(
        <Menu>
          <MenuItem role="listitem">test</MenuItem>
        </Menu>,
      );

      expect(container.querySelector('li')).toMatchSnapshot();
    });

    it('should set role to option', () => {
      const { container } = render(
        <Menu>
          <MenuItem role="option">test</MenuItem>
        </Menu>,
      );

      expect(container.querySelector('li')).toMatchSnapshot();
    });
  });
});
