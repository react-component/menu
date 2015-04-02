/** @jsx React.DOM */
var React = require('react');
var Menu = require('rc-menu');
var SubMenu = Menu.SubMenu;
var MenuItem = Menu.Item;

require('rc-menu/assets/index.css');
require('font-awesome/css/font-awesome.css');

function handleSelect(selectedKey) {
  console.log('selected ' + selectedKey);
}

function handleDeselect(selectedKey) {
  console.log('deselect ' + selectedKey);
}

var style = `
.rc-top-menu {
  zoom:1;
}
.rc-top-menu:after {
  content:"\20";
  display:block;
  height:0;
  clear:both;
}
.rc-menu-submenu-pull-down > .rc-menu {
  top:100%;
  left:0;
}
.rc-top-menu > .rc-menu-submenu,.rc-top-menu > .rc-menu-item {
  float:left
}
`;

var titleRight = <span>sub menu
  <i className="fa fa-caret-down pull-right"></i>
</span>;
var titleRight1 = <span>sub menu 1
  <i className="fa fa-caret-down pull-right"></i>
</span>;
var titleRight2 = <span>sub menu 2
  <i className="fa fa-caret-right pull-right"></i>
</span>;
var titleRight3 = <span>sub menu 3
  <i className="fa fa-caret-right pull-right"></i>
</span>;
var container = document.getElementById('__react-content');

render(container);

function render(container) {
  var leftMenu = (
    <Menu onSelect={handleSelect} onDeselect={handleDeselect} className="rc-top-menu">
      <SubMenu title={titleRight} key="1" className="rc-menu-submenu-pull-down">
        <MenuItem key="1-1">0-1</MenuItem>
        <MenuItem key="1-2">0-2</MenuItem>
      </SubMenu>
      <MenuItem key="2">1</MenuItem>
      <MenuItem key="3">outer</MenuItem>
      <SubMenu title={titleRight1} key="4" className="rc-menu-submenu-pull-down">
        <MenuItem key="4-1">inner inner</MenuItem>
        <MenuItem disabled className="rc-menu-item-divider" />
        <SubMenu
          openOnHover={false}
          key="4-2"
          title={titleRight2}
        >
          <MenuItem key="4-2-1">inn</MenuItem>
          <SubMenu title={titleRight3} key="4-2-2">
            <Menu>
              <MenuItem key="4-2-2-1">inner inner</MenuItem>
              <MenuItem key="4-2-2-2">inner inner2</MenuItem>
            </Menu>
          </SubMenu>
        </SubMenu>
      </SubMenu>
      <MenuItem disabled>disabled</MenuItem>
      <MenuItem key="4-3">outer3</MenuItem>
    </Menu>
  );
  React.render(<div>
    <style dangerouslySetInnerHTML={{__html: style}}></style>
    <h1>single selectable menu</h1>
    <div style={{width: 800}}>{leftMenu}</div>
  </div>, container);
}
