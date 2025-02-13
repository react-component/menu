/* eslint-disable no-undef */
import { fireEvent, render } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import Menu from '../src';

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
        <Menu
          mode="vertical"
          itemIcon={itemIcon}
          expandIcon={expandIcon}
          items={[
            {
              key: '1',
              label: '1',
            },
          ]}
        />,
      );
      const menuItemText = container.querySelector('.rc-menu-item').textContent;
      expect(menuItemText).toEqual(`1${menuItemIconText}`);
    });

    it('should render custom arrow icon correctly (with children props).', () => {
      const targetText = 'target';
      const { container } = render(
        <Menu
          mode="vertical"
          itemIcon={itemIcon}
          expandIcon={expandIcon}
          items={[
            {
              key: '1',
              label: '1',
              itemIcon: () => <span>{targetText}</span>,
            },
            {
              key: '2',
              label: '2',
            },
          ]}
        />,
      );
      const menuItemText = container.querySelector('.rc-menu-item').textContent;
      expect(menuItemText).toEqual(`1${targetText}`);
    });
  });

  it('not fires select event when disabled', () => {
    const handleSelect = jest.fn();
    const { container } = render(
      <Menu
        onSelect={handleSelect}
        items={[
          {
            key: '1',
            disabled: true,
            label: <span className="xx">Item content</span>,
          },
        ]}
      />,
    );

    fireEvent.click(container.querySelector('.xx'));
    expect(handleSelect).not.toBeCalled();
  });

  describe('menuItem events', () => {
    function renderMenu(props, itemProps) {
      return render(
        <Menu
          {...props}
          items={[
            {
              key: 'light',
              label: 'light',
              ...itemProps,
            },
          ]}
        />,
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
        <Menu
          mode="inline"
          activeKey="1"
          openKeys={['bamboo']}
          items={[
            {
              key: '1',
              label: '1',
              ...restProps,
            },
            {
              key: 'bamboo',
              label: 'bamboo',
              type: 'submenu',
              ...restProps,
              children: [
                {
                  key: '2',
                  label: '3',
                  ...restProps,
                },
              ],
            },
            {
              type: 'group',
              ...restProps,
              children: [
                {
                  key: '3',
                  label: '4',
                  ...restProps,
                },
              ],
            },
          ]}
        />,
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
        <Menu
          items={[
            {
              key: '1',
              label: 'test',
              role: null,
            },
          ]}
        />,
      );

      expect(container.querySelector('li')).toMatchSnapshot();
    });

    it('should set role to none if none', () => {
      const { container } = render(
        <Menu
          items={[
            {
              key: '1',
              label: 'test',
              role: 'none',
            },
          ]}
        />,
      );

      expect(container.querySelector('li')).toMatchSnapshot();
    });

    it('should set role to listitem', () => {
      const { container } = render(
        <Menu
          items={[
            {
              key: '1',
              label: 'test',
              role: 'listitem',
            },
          ]}
        />,
      );

      expect(container.querySelector('li')).toMatchSnapshot();
    });

    it('should set role to option', () => {
      const { container } = render(
        <Menu
          items={[
            {
              key: '1',
              label: 'test',
              role: 'option',
            },
          ]}
        />,
      );

      expect(container.querySelector('li')).toMatchSnapshot();
    });

    it('should set extra to option', () => {
      const { container } = render(
        <Menu
          items={[
            {
              label: 'Top Menu Item',
              key: 'top',
              extra: '⌘B',
            },
          ]}
        />,
      );

      expect(container.querySelector('li')).toMatchSnapshot();
    });

    it('should set extra to group option', () => {
      const { container } = render(
        <Menu
          items={[
            {
              type: 'group',
              label: 'Top Menu Group with children',
              children: [
                {
                  label: 'Menu Item 1',
                  key: 'top',
                  extra: '⌘B',
                },
              ],
            },
          ]}
        />,
      );

      expect(container.querySelector('li')).toMatchSnapshot();
    });
  });
});
