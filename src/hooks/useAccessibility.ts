import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import raf from 'rc-util/lib/raf';
import { getFocusNodeList } from 'rc-util/lib/Dom/focus';
import type { MenuMode } from '../interface';
import { getMenuId } from '../context/IdContext';

// destruct to reduce minify size
const { LEFT, RIGHT, UP, DOWN, ENTER, ESC } = KeyCode;

const ArrowKeys = [UP, DOWN, LEFT, RIGHT];

function getOffset(
  mode: MenuMode,
  isRootLevel: boolean,
  isRtl: boolean,
  which: number,
): {
  offset?: number;
  sibling?: boolean;
  inlineTrigger?: boolean;
} {
  const prev = 'prev' as const;
  const next = 'next' as const;
  const children = 'children' as const;
  const parent = 'parent' as const;

  // Inline enter is special that we use unique operation
  if (mode === 'inline' && which === ENTER) {
    return {
      inlineTrigger: true,
    };
  }

  type OffsetMap = Record<number, 'prev' | 'next' | 'children' | 'parent'>;
  const inline: OffsetMap = {
    [UP]: prev,
    [DOWN]: next,
  };
  const horizontal: OffsetMap = {
    [LEFT]: isRtl ? next : prev,
    [RIGHT]: isRtl ? prev : next,
    [DOWN]: children,
    [ENTER]: children,
  };
  const vertical: OffsetMap = {
    [UP]: prev,
    [DOWN]: next,
    [ENTER]: children,
    [ESC]: parent,
    [LEFT]: isRtl ? children : parent,
    [RIGHT]: isRtl ? parent : children,
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

  // Normally should not reach this line
  /* istanbul ignore next */
  return null;
}

/**
 * Find focused element within element set provided
 */
function getFocusElement(
  activeElement: HTMLElement,
  elements: Set<HTMLElement>,
): HTMLElement {
  let current = activeElement || document.activeElement;

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
  // Key on the menu item will not get validate parent container
  if (!parentQueryContainer) {
    return null;
  }

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
  activeKey: string,
  isRtl: boolean,
  id: string,

  containerRef: React.RefObject<HTMLUListElement>,
  getKeys: () => string[],
  getKeyPath: (key: string, includeOverflow?: boolean) => string[],

  triggerActiveKey: (key: string) => void,
  triggerAccessibilityOpen: (key: string, open?: boolean) => void,

  originOnKeyDown?: React.KeyboardEventHandler<T>,
): React.KeyboardEventHandler<T> {
  const rafRef = React.useRef<number>();

  const activeRef = React.useRef<string>();
  activeRef.current = activeKey;

  const cleanRaf = () => {
    raf.cancel(rafRef.current);
  };

  React.useEffect(
    () => () => {
      cleanRaf();
    },
    [],
  );

  return e => {
    const { which } = e;

    if ([...ArrowKeys, ENTER, ESC].includes(which)) {
      // Convert key to elements
      let elements: Set<HTMLElement>;
      let key2element: Map<string, HTMLElement>;
      let element2key: Map<HTMLElement, string>;

      // >>> Wrap as function since we use raf for some case
      const refreshElements = () => {
        elements = new Set<HTMLElement>();
        key2element = new Map();
        element2key = new Map();

        const keys = getKeys();

        keys.forEach(key => {
          const element = document.querySelector(
            `[data-menu-id='${getMenuId(id, key)}']`,
          ) as HTMLElement;

          if (element) {
            elements.add(element);
            element2key.set(element, key);
            key2element.set(key, element);
          }
        });

        return elements;
      };

      refreshElements();

      // First we should find current focused MenuItem/SubMenu element
      const activeElement = key2element.get(activeKey);
      const focusMenuElement = getFocusElement(activeElement, elements);
      const focusMenuKey = element2key.get(focusMenuElement);

      const offsetObj = getOffset(
        mode,
        getKeyPath(focusMenuKey, true).length === 1,
        isRtl,
        which,
      );

      // Some mode do not have fully arrow operation like inline
      if (!offsetObj) {
        return;
      }

      // Arrow prevent default to avoid page scroll
      if (ArrowKeys.includes(which)) {
        e.preventDefault();
      }

      const tryFocus = (menuElement: HTMLElement) => {
        if (menuElement) {
          let focusTargetElement = menuElement;

          // Focus to link instead of menu item if possible
          const link = menuElement.querySelector('a');
          if (link?.getAttribute('href')) {
            focusTargetElement = link;
          }

          const targetKey = element2key.get(menuElement);
          triggerActiveKey(targetKey);

          /**
           * Do not `useEffect` here since `tryFocus` may trigger async
           * which makes React sync update the `activeKey`
           * that force render before `useRef` set the next activeKey
           */
          cleanRaf();
          rafRef.current = raf(() => {
            if (activeRef.current === targetKey) {
              focusTargetElement.focus();
            }
          });
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
          elements,
          focusMenuElement,
          offsetObj.offset,
        );

        // Focus menu item
        tryFocus(targetElement);

        // ======================= InlineTrigger =======================
      } else if (offsetObj.inlineTrigger) {
        // Inline trigger no need switch to sub menu item
        triggerAccessibilityOpen(focusMenuKey);
        // =========================== Level ===========================
      } else if (offsetObj.offset > 0) {
        triggerAccessibilityOpen(focusMenuKey, true);

        cleanRaf();
        rafRef.current = raf(() => {
          // Async should resync elements
          refreshElements();

          const controlId = focusMenuElement.getAttribute('aria-controls');
          const subQueryContainer = document.getElementById(controlId);

          // Get sub focusable menu item
          const targetElement = getNextFocusElement(
            subQueryContainer,
            elements,
          );

          // Focus menu item
          tryFocus(targetElement);
        }, 5);
      } else if (offsetObj.offset < 0) {
        const keyPath = getKeyPath(focusMenuKey, true);
        const parentKey = keyPath[keyPath.length - 2];

        const parentMenuElement = key2element.get(parentKey);

        // Focus menu item
        triggerAccessibilityOpen(parentKey, false);
        tryFocus(parentMenuElement);
      }
    }

    // Pass origin key down event
    originOnKeyDown?.(e);
  };
}
