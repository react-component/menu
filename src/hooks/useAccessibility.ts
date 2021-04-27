import type * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { getFocusNodeList } from 'rc-util/lib/Dom/focus';
import type { MenuMode } from '../interface';

function getOffset(
  mode: MenuMode,
  which: number,
): {
  offset: number;
  sibling: boolean;
} {
  const prev = 'prev' as const;
  const next = 'next' as const;
  const children = 'children' as const;
  const parent = 'parent' as const;

  const offsets: Record<
    MenuMode,
    Record<number, 'prev' | 'next' | 'children' | 'parent'>
  > = {
    inline: {
      [KeyCode.UP]: prev,
      [KeyCode.DOWN]: next,
    },
    horizontal: {
      [KeyCode.LEFT]: prev,
      [KeyCode.RIGHT]: next,
      [KeyCode.UP]: parent,
      [KeyCode.DOWN]: children,
    },
    vertical: {
      [KeyCode.UP]: prev,
      [KeyCode.DOWN]: next,
      [KeyCode.LEFT]: parent,
      [KeyCode.RIGHT]: children,
    },
  };

  const type = offsets[mode]?.[which];

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
    if (current.tagName?.toUpperCase() === 'UL') {
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

export default function useAccessibility<T extends HTMLElement>(
  containerRef: React.RefObject<HTMLUListElement>,
  elementsRef: React.RefObject<Set<HTMLElement>>,
  mode: MenuMode,
  activeByElement: (element: HTMLElement) => void,
  triggerElement: (element: HTMLElement, open: boolean) => void,
  originOnKeyDown?: React.KeyboardEventHandler<T>,
): React.KeyboardEventHandler<T> {
  return e => {
    const { which } = e;

    const offsetObj = getOffset(mode, which);

    if (offsetObj !== null) {
      // First we should find current focused MenuItem/SubMenu element
      const focusMenuElement = getFocusElement(elementsRef.current);

      // Find walkable focus menu element container
      let parentQueryContainer: HTMLElement;
      if (!focusMenuElement || mode === 'inline') {
        parentQueryContainer = containerRef.current;
      } else {
        parentQueryContainer = findContainerUL(focusMenuElement);
      }

      // List current level menu item elements
      const sameLevelFocusableMenuElementList = getFocusableElements(
        parentQueryContainer,
        elementsRef.current,
      );

      if (offsetObj.sibling || !focusMenuElement) {
        // ========================== Sibling ==========================
        // Find next focus index
        const count = sameLevelFocusableMenuElementList.length;
        let focusIndex = sameLevelFocusableMenuElementList.findIndex(
          ele => focusMenuElement === ele,
        );

        if (offsetObj.offset < 0) {
          if (focusIndex === -1) {
            focusIndex = count - 1;
          } else {
            focusIndex -= 1;
          }
        } else if (offsetObj.offset > 0) {
          focusIndex += 1;
        }

        focusIndex = (focusIndex + count) % count;

        // Focus menu item
        const targetElement = sameLevelFocusableMenuElementList[focusIndex];
        if (targetElement) {
          targetElement.focus();
          activeByElement(targetElement);

          console.log('>>>', targetElement);

          e.preventDefault();
        }

        // =========================== Level ===========================
      } else if (offsetObj.offset > 0) {
        triggerElement(focusMenuElement, true);
      } else if (offsetObj.offset < 0) {
        triggerElement(focusMenuElement, false);
      }
    }

    // Pass origin key down event
    originOnKeyDown?.(e);
  };
}
