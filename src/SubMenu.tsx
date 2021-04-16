import * as React from 'react';
import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import Overflow from 'rc-overflow';
import SubMenuList from './SubMenuList';
import { parseChildren } from './utils/nodeUtil';
import type {
  MenuClickEventHandler,
  MenuHoverEventHandler,
  MenuInfo,
  MenuTitleInfo,
  RenderIconType,
} from './interface';
import MenuContextProvider, { MenuContext } from './context';
import useMemoCallback from './hooks/useMemoCallback';
import PopupTrigger from './PopupTrigger';
import Icon from './Icon';
import useActive from './hooks/useActive';
import { warnItemProp } from './utils/warnUtil';

export interface SubMenuProps {
  title?: React.ReactNode;
  children?: React.ReactNode;

  disabled?: boolean;

  /** @private Internal filled key. Do not set it directly */
  eventKey?: string;

  // >>>>> Icon
  // itemIcon?: RenderIconType;
  expandIcon?: RenderIconType;

  // >>>>> Active
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
  onTitleClick?: (info: MenuTitleInfo) => void;

  // onOpenChange?: OpenEventHandler;
  // rootPrefixCls?: string;
  // multiple?: boolean;
  // active?: boolean; // TODO: remove
  // onItemHover?: HoverEventHandler;
  // triggerSubMenuAction?: TriggerSubMenuAction;
  // onDestroy?: DestroyEventHandler;
  // onTitleMouseEnter?: MenuHoverEventHandler;
  // onTitleMouseLeave?: MenuHoverEventHandler;
  // popupOffset?: number[];
  // isOpen?: boolean;
  // store?: MiniStore;
  // mode?: MenuMode;
  // manualRef?: LegacyFunctionRef;
  // inlineIndent?: number;
  // level?: number;
  // subMenuOpenDelay?: number;
  // subMenuCloseDelay?: number;
  // forceSubMenuRender?: boolean;
  // builtinPlacements?: BuiltinPlacements;
  // className?: string;
  // popupClassName?: string;
  // motion?: CSSMotionProps;
  // direction?: 'ltr' | 'rtl';

  // >>>>>>>>>>>>>>>>>>> Useless content <<<<<<<<<<<<<<<<<<<<<

  // parentMenu?: React.ReactElement & {
  //   isRootMenu: boolean;
  //   subMenuInstance: React.ReactInstance;
  // };

  // selectedKeys?: string[];
  // openKeys?: string[];
}

export default function SubMenu(props: SubMenuProps) {
  const {
    title,
    eventKey,

    disabled,

    children,

    // Icons
    expandIcon,

    // Active
    onMouseEnter,
    onMouseLeave,

    // Events
    onClick,
    onTitleClick,
  } = props;

  const {
    prefixCls,
    mode,
    openKeys,
    motion,
    parentKeys,

    // ActiveKey
    activeKey,

    // SelectKey
    selectedKeys,

    // Path
    registerPath,
    unregisterPath,
    keyInPath,

    // Events
    onItemClick,
    onOpenChange,
  } = React.useContext(MenuContext);

  const subMenuPrefixCls = `${prefixCls}-submenu`;

  // ================================ Key =================================
  const connectedKeys = React.useMemo(() => [...parentKeys, eventKey], [
    parentKeys,
    eventKey,
  ]);

  // ============================== Children ==============================
  const childList: React.ReactElement[] = parseChildren(
    children,
    connectedKeys,
  );

  // ================================ Open ================================
  const open = openKeys.includes(eventKey);

  // =============================== Select ===============================
  const childrenSelected = keyInPath(selectedKeys, connectedKeys);

  // =============================== Active ===============================
  const { active, ...activeProps } = useActive(
    eventKey,
    disabled,
    onMouseEnter,
    onMouseLeave,
  );

  const mergedActive = active || keyInPath([activeKey], connectedKeys);

  // =============================== Events ===============================
  // >>>> Title click
  const onInternalTitleClick: React.MouseEventHandler<HTMLElement> = e => {
    // Skip if disabled
    if (disabled) {
      return;
    }

    onTitleClick?.({
      key: eventKey,
      domEvent: e,
    });

    // Trigger open by click when mode is `inline`
    if (mode === 'inline') {
      onOpenChange(eventKey, !openKeys.includes(eventKey));
    }
  };

  // >>>> Context for children click
  const onMergedItemClick = useMemoCallback((info: MenuInfo) => {
    onClick?.(warnItemProp(info));
    onItemClick(info);
  });

  // >>>>> Visible change
  const onPopupVisibleChange = (newVisible: boolean) => {
    onOpenChange(eventKey, newVisible);
  };

  // =============================== Effect ===============================
  // Path register
  React.useEffect(() => {
    registerPath(eventKey, connectedKeys);

    return () => {
      unregisterPath(eventKey, connectedKeys);
    };
  }, [eventKey, connectedKeys]);

  // =============================== Render ===============================

  // >>>>> Title
  let titleNode: React.ReactElement = (
    <div
      className={`${subMenuPrefixCls}-title`}
      role="button"
      aria-expanded
      aria-haspopup
      onClick={onInternalTitleClick}
      {...activeProps}
    >
      {title}

      {/* Only non-horizontal mode shows the icon */}
      {mode !== 'horizontal' && (
        <Icon
          icon={expandIcon}
          props={{
            ...props,
            // [Legacy] Not sure why need this mark
            isSubMenu: true,
          }}
        >
          <i className={`${subMenuPrefixCls}-arrow`} />
        </Icon>
      )}
    </div>
  );

  if (mode !== 'inline') {
    titleNode = (
      <PopupTrigger
        mode={mode}
        prefixCls={subMenuPrefixCls}
        visible={open}
        popup={<SubMenuList>{childList}</SubMenuList>}
        disabled={disabled}
        onVisibleChange={onPopupVisibleChange}
      >
        {titleNode}
      </PopupTrigger>
    );
  }

  // >>>>> Render
  return (
    <MenuContextProvider
      parentKeys={connectedKeys}
      onItemClick={onMergedItemClick}
      mode={mode === 'horizontal' ? 'vertical' : mode}
    >
      <Overflow.Item
        component="li"
        className={classNames(subMenuPrefixCls, `${subMenuPrefixCls}-${mode}`, {
          [`${subMenuPrefixCls}-open`]: open,
          [`${subMenuPrefixCls}-active`]: mergedActive,
          [`${subMenuPrefixCls}-selected`]: childrenSelected,
        })}
        role="menuitem"
      >
        {titleNode}

        {/* Inline mode */}
        {mode === 'inline' && (
          <CSSMotion visible={open} {...motion}>
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
