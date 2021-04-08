import * as React from 'react';
import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import Overflow from 'rc-overflow';
import SubMenuList from './SubMenuList';
import { parseChildren } from './utils/nodeUtil';
import type {
  MenuClickEventHandler,
  MenuInfo,
  MenuTitleInfo,
} from './interface';
import MenuContextProvider, { MenuContext } from './context';
import useMemoCallback from './hooks/useMemoCallback';

export interface SubMenuProps {
  title?: React.ReactNode;
  children?: React.ReactNode;

  /** @private Internal filled key. Do not set it directly */
  eventKey?: string;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
  onTitleClick?: (info: MenuTitleInfo) => void;

  // parentMenu?: React.ReactElement & {
  //   isRootMenu: boolean;
  //   subMenuInstance: React.ReactInstance;
  // };

  // selectedKeys?: string[];
  // openKeys?: string[];

  // onOpenChange?: OpenEventHandler;
  // rootPrefixCls?: string;
  // multiple?: boolean;
  // active?: boolean; // TODO: remove
  // onItemHover?: HoverEventHandler;
  // onSelect?: SelectEventHandler;
  // triggerSubMenuAction?: TriggerSubMenuAction;
  // onDeselect?: SelectEventHandler;
  // onDestroy?: DestroyEventHandler;
  // onMouseEnter?: MenuHoverEventHandler;
  // onMouseLeave?: MenuHoverEventHandler;
  // onTitleMouseEnter?: MenuHoverEventHandler;
  // onTitleMouseLeave?: MenuHoverEventHandler;
  // popupOffset?: number[];
  // isOpen?: boolean;
  // store?: MiniStore;
  // mode?: MenuMode;
  // manualRef?: LegacyFunctionRef;
  // itemIcon?: RenderIconType;
  // expandIcon?: RenderIconType;
  // inlineIndent?: number;
  // level?: number;
  // subMenuOpenDelay?: number;
  // subMenuCloseDelay?: number;
  // forceSubMenuRender?: boolean;
  // builtinPlacements?: BuiltinPlacements;
  // disabled?: boolean;
  // className?: string;
  // popupClassName?: string;
  // motion?: CSSMotionProps;
  // direction?: 'ltr' | 'rtl';
}

export default function SubMenu({
  title,
  eventKey,
  children,

  // Events
  onClick,
  onTitleClick,
}: SubMenuProps) {
  const {
    prefixCls,
    mode,
    openKeys,
    motion,
    parentKeys,

    // Events
    onItemClick,
    onSubMenuClick,
  } = React.useContext(MenuContext);
  const subMenuPrefixCls = `${prefixCls}-submenu`;

  // ================================ Key =================================
  const connectedKeys = React.useMemo(() => [...parentKeys, eventKey], [
    parentKeys,
    eventKey,
  ]);

  // ============================== Visible ===============================
  const visible = openKeys.includes(eventKey);

  // =============================== Events ===============================
  const onInternalTitleClick: React.MouseEventHandler<HTMLElement> = e => {
    onTitleClick?.({
      key: eventKey,
      domEvent: e,
    });

    onSubMenuClick(eventKey);
  };

  const onMergedItemClick = useMemoCallback((info: MenuInfo) => {
    onClick?.(info);
    onItemClick(info);
  });

  // =============================== Render ===============================
  const childList: React.ReactElement[] = parseChildren(children);

  return (
    <MenuContextProvider
      parentKeys={connectedKeys}
      onItemClick={onMergedItemClick}
    >
      <Overflow.Item
        component="li"
        className={classNames(subMenuPrefixCls, `${subMenuPrefixCls}-${mode}`)}
        role="menuitem"
      >
        <div
          className={`${subMenuPrefixCls}-title`}
          role="button"
          aria-expanded
          aria-haspopup
          onClick={onInternalTitleClick}
        >
          {title}
        </div>
        {mode === 'inline' && (
          <CSSMotion visible={visible} {...motion}>
            {({ className, style }) => {
              return (
                <SubMenuList className={className} style={style}>
                  {childList}
                </SubMenuList>
              );
            }}
          </CSSMotion>
        )}
      </Overflow.Item>
    </MenuContextProvider>
  );
}
