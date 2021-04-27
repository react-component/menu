import type * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { getFocusNodeList } from 'rc-util/lib/Dom/focus';
import type { MenuMode } from '../interface';

const ARROW_LIST = [KeyCode.LEFT, KeyCode.RIGHT, KeyCode.UP, KeyCode.DOWN];

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
  originOnKeyDown?: React.KeyboardEventHandler<T>,
): React.KeyboardEventHandler<T> {
  return e => {
    const { which } = e;

    if (ARROW_LIST.includes(which)) {
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

      // Find next focus index
      const count = sameLevelFocusableMenuElementList.length;
      let focusIndex = sameLevelFocusableMenuElementList.findIndex(
        ele => document.activeElement === ele,
      );

      if (which === KeyCode.UP) {
        if (focusIndex === -1) {
          focusIndex = count - 1;
        } else {
          focusIndex -= 1;
        }
      } else if (which === KeyCode.DOWN) {
        focusIndex += 1;
      }

      focusIndex = (focusIndex + count) % count;

      // Focus menu item
      const targetElement = sameLevelFocusableMenuElementList[focusIndex];
      if (targetElement) {
        targetElement.focus();
        activeByElement(targetElement);
      }
    }

    // Pass origin key down event
    originOnKeyDown?.(e);
  };
}
