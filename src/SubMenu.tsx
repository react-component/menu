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
import useDirectionStyle from './hooks/useDirectionStyle';
import { getMotion } from './utils/motionUtil';

export interface SubMenuProps {
  style?: React.CSSProperties;
  className?: string;

  title?: React.ReactNode;
  children?: React.ReactNode;

  disabled?: boolean;

  /** @private Internal filled key. Do not set it directly */
  eventKey?: string;

  // >>>>> Icon
  itemIcon?: RenderIconType;
  expandIcon?: RenderIconType;

  // >>>>> Active
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;

  // >>>>> Popup
  popupClassName?: string;
  popupOffset?: number[];

  // >>>>> Events
  onClick?: MenuClickEventHandler;
  onTitleClick?: (info: MenuTitleInfo) => void;
  onTitleMouseEnter?: MenuHoverEventHandler;
  onTitleMouseLeave?: MenuHoverEventHandler;

  // >>>>>>>>>>>>>>>>>>>>> Next  Round <<<<<<<<<<<<<<<<<<<<<<<
  // onDestroy?: DestroyEventHandler;
}

export default function SubMenu(props: SubMenuProps) {
  const {
    style,
    className,

    title,
    eventKey,

    disabled,

    children,

    // Icons
    itemIcon,
    expandIcon,

    // Popup
    popupClassName,
    popupOffset,

    // Events
    onClick,
    onMouseEnter,
    onMouseLeave,
    onTitleClick,
    onTitleMouseEnter,
    onTitleMouseLeave,
  } = props;

  const {
    prefixCls,
    mode,
    openKeys,
    parentKeys,
    forceSubMenuRender,

    // Disabled
    disabled: contextDisabled,
    openDisabled,

    // Motion
    motion,
    defaultMotions,

    // ActiveKey
    activeKey,

    // SelectKey
    selectedKeys,

    // Path
    registerPath,
    unregisterPath,
    keyInPath,

    // Icon
    itemIcon: contextItemIcon,
    expandIcon: contextExpandIcon,

    // Events
    onItemClick,
    onOpenChange,
  } = React.useContext(MenuContext);

  const subMenuPrefixCls = `${prefixCls}-submenu`;
  const mergedDisabled = contextDisabled || disabled;

  // ================================ Key =================================
  const connectedKeys = React.useMemo(() => [...parentKeys, eventKey], [
    parentKeys,
    eventKey,
  ]);

  // ================================ Icon ================================
  const mergedItemIcon = itemIcon || contextItemIcon;
  const mergedExpandIcon = expandIcon || contextExpandIcon;

  // ============================== Children ==============================
  const childList: React.ReactElement[] = parseChildren(
    children,
    connectedKeys,
  );

  // ================================ Open ================================
  const open = !openDisabled && openKeys.includes(eventKey);

  // =============================== Select ===============================
  const childrenSelected = keyInPath(selectedKeys, connectedKeys);

  // =============================== Active ===============================
  const { active, ...activeProps } = useActive(
    eventKey,
    mergedDisabled,
    onTitleMouseEnter,
    onTitleMouseLeave,
  );

  // Fallback of active check to avoid hover on menu title or disabled item
  const [childrenActive, setChildrenActive] = React.useState(false);

  const mergedActive =
    active || childrenActive || keyInPath([activeKey], connectedKeys);

  // ========================== DirectionStyle ==========================
  const directionStyle = useDirectionStyle(connectedKeys);

  // =============================== Events ===============================
  // >>>> Title click
  const onInternalTitleClick: React.MouseEventHandler<HTMLElement> = e => {
    // Skip if disabled
    if (mergedDisabled) {
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

  // >>>>> Hover
  const hoverProps: React.HTMLAttributes<HTMLDivElement> = {};
  if (!mergedDisabled) {
    hoverProps.onMouseEnter = domEvent => {
      onMouseEnter?.({
        key: eventKey,
        domEvent,
      });
    };
    hoverProps.onMouseLeave = domEvent => {
      onMouseLeave?.({
        key: eventKey,
        domEvent,
      });
    };
  }

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
      style={directionStyle}
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
          icon={mergedExpandIcon}
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
        popupClassName={popupClassName}
        popupOffset={popupOffset}
        popup={<SubMenuList>{childList}</SubMenuList>}
        disabled={mergedDisabled}
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
      itemIcon={mergedItemIcon}
      expandIcon={mergedExpandIcon}
    >
      <Overflow.Item
        component="li"
        style={style}
        className={classNames(
          subMenuPrefixCls,
          `${subMenuPrefixCls}-${mode}`,
          className,
          {
            [`${subMenuPrefixCls}-open`]: open,
            [`${subMenuPrefixCls}-active`]: mergedActive,
            [`${subMenuPrefixCls}-selected`]: childrenSelected,
          },
        )}
        role="menuitem"
        onMouseEnter={() => {
          setChildrenActive(true);
        }}
        onMouseLeave={() => {
          setChildrenActive(false);
        }}
      >
        {titleNode}

        {/* Inline mode */}
        {mode === 'inline' && (
          <CSSMotion
            visible={open}
            forceRender={forceSubMenuRender}
            {...getMotion(mode, motion, defaultMotions)}
          >
            {({ className: motionClassName, style: motionStyle }) => {
              return (
                <SubMenuList className={motionClassName} style={motionStyle}>
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
