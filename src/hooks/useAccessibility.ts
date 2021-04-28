import type * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import raf from 'rc-util/lib/raf';
import { getFocusNodeList } from 'rc-util/lib/Dom/focus';
import type { MenuMode } from '../interface';

// destruct to reduce minify size
const { LEFT, RIGHT, UP, DOWN } = KeyCode;

function getOffset(
  mode: MenuMode,
  isRootLevel: boolean,
  which: number,
): {
  offset: number;
  sibling: boolean;
} {
  const prev = 'prev' as const;
  const next = 'next' as const;
  const children = 'children' as const;
  const parent = 'parent' as const;

  type OffsetMap = Record<number, 'prev' | 'next' | 'children' | 'parent'>;
  const inline: OffsetMap = {
    [UP]: prev,
    [DOWN]: next,
  };
  const horizontal: OffsetMap = {
    [LEFT]: prev,
    [RIGHT]: next,
    [UP]: parent,
    [DOWN]: children,
  };
  const vertical: OffsetMap = {
    [UP]: prev,
    [DOWN]: next,
    [LEFT]: parent,
    [RIGHT]: children,
  };

  const offsets: Record<
    string,
    Record<number, 'prev' | 'next' | 'children' | 'parent'>
  > = {
    inline,
    horizontal,
    vertical,
    inlineSub: inline,
    horizontalSub: vertical,
    verticalSub: vertical,
  };

  const type = offsets[`${mode}${isRootLevel ? '' : 'Sub'}`]?.[which];

  switch (type) {
    case prev:
      return {
        offset: -1,
        sibling: true,
      };

    case next:
      return {
        offset: 1,
        sibling: true,
      };

    case parent:
      return {
        offset: -1,
        sibling: false,
      };

    case children:
      return {
        offset: 1,
        sibling: false,
      };

    default:
      return null;
  }
}

function findContainerUL(element: HTMLElement): HTMLUListElement {
  let current: HTMLElement = element;
  while (current) {
    if (current.getAttribute('data-menu-list')) {
      return current as HTMLUListElement;
    }

    current = current.parentElement;
  }

  return null;
}

/**
 * Find focused element within element set provided
 */
function getFocusElement(elements: Set<HTMLElement>): HTMLElement {
  let current = document.activeElement;

  while (current) {
    if (elements.has(current as any)) {
      return current as HTMLElement;
    }

    current = current.parentElement;
  }

  return null;
}

/**
 * Get focusable elements from the element set under provided container
 */
function getFocusableElements(
  container: HTMLElement,
  elements: Set<HTMLElement>,
) {
  const list = getFocusNodeList(container, true);
  return list.filter(ele => elements.has(ele));
}

function getNextFocusElement(
  parentQueryContainer: HTMLElement,
  elements: Set<HTMLElement>,
  focusMenuElement?: HTMLElement,
  offset: number = 1,
) {
  // List current level menu item elements
  const sameLevelFocusableMenuElementList = getFocusableElements(
    parentQueryContainer,
    elements,
  );

  // Find next focus index
  const count = sameLevelFocusableMenuElementList.length;
  let focusIndex = sameLevelFocusableMenuElementList.findIndex(
    ele => focusMenuElement === ele,
  );

  if (offset < 0) {
    if (focusIndex === -1) {
      focusIndex = count - 1;
    } else {
      focusIndex -= 1;
    }
  } else if (offset > 0) {
    focusIndex += 1;
  }

  focusIndex = (focusIndex + count) % count;

  // Focus menu item
  return sameLevelFocusableMenuElementList[focusIndex];
}

export default function useAccessibility<T extends HTMLElement>(
  mode: MenuMode,

  containerRef: React.RefObject<HTMLUListElement>,
  elementsRef: React.RefObject<Set<HTMLElement>>,

  isElementRootLevel: (element: HTMLElement) => boolean,
  activeByElement: (element: HTMLElement) => void,
  triggerElement: (element: HTMLElement, open: boolean) => void,

  originOnKeyDown?: React.KeyboardEventHandler<T>,
): React.KeyboardEventHandler<T> {
  return e => {
    const { which } = e;

    if ([UP, DOWN, LEFT, RIGHT].includes(which)) {
      // First we should find current focused MenuItem/SubMenu element
      const focusMenuElement = getFocusElement(elementsRef.current);

      const offsetObj = getOffset(
        mode,
        isElementRootLevel(focusMenuElement),
        which,
      );
      console.log('===>', offsetObj);

      e.preventDefault();

      const tryFocus = (menuElement: HTMLElement) => {
        if (menuElement) {
          menuElement.focus();
          activeByElement(menuElement);
        }
      };

      if (offsetObj.sibling || !focusMenuElement) {
        // ========================== Sibling ==========================
        // Find walkable focus menu element container
        let parentQueryContainer: HTMLElement;
        if (!focusMenuElement || mode === 'inline') {
          parentQueryContainer = containerRef.current;
        } else {
          parentQueryContainer = findContainerUL(focusMenuElement);
        }

        // Get next focus element
        const targetElement = getNextFocusElement(
          parentQueryContainer,
          elementsRef.current,
          focusMenuElement,
          offsetObj.offset,
        );

        // Focus menu item
        tryFocus(targetElement);

        // =========================== Level ===========================
      } else if (offsetObj.offset > 0) {
        triggerElement(focusMenuElement, true);

        raf(() => {
          const controlId = focusMenuElement.getAttribute('aria-controls');
          const subQueryContainer = document.getElementById(controlId);

          // Get sub focusable menu item
          const targetElement = getNextFocusElement(
            subQueryContainer,
            elementsRef.current,
          );

          // Focus menu item
          tryFocus(targetElement);
        }, 5);
      } else if (offsetObj.offset < 0) {
        triggerElement(focusMenuElement, false);
      }
    }

    // Pass origin key down event
    originOnKeyDown?.(e);
  };
}
