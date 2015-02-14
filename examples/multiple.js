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

var titleRight = <span>sub menu <i className="fa fa-caret-right pull-right"></i></span>;
var titleRight1 = <span>sub menu 1 <i className="fa fa-caret-right pull-right"></i></span>;
var titleRight2 = <span>sub menu 2 <i className="fa fa-caret-right pull-right"></i></span>;
var titleRight3 = <span>sub menu 3 <i className="fa fa-caret-right pull-right"></i></span>;
var container = document.getElementById('__react-content');

render(container);

function render(container){
  var leftMenu = (
    <Menu  multiple={true} onSelect={handleSelect} onDeselect={handleDeselect}>
      <SubMenu title={titleRight}>
        <MenuItem>0-1</MenuItem>
        <MenuItem>0-2</MenuItem>
      </SubMenu>
      <MenuItem key="10">1</MenuItem>
      <MenuItem key="31">outer</MenuItem>
      <SubMenu title={titleRight1}>
        <MenuItem key="31">inner inner</MenuItem>
        <MenuItem disabled className="rc-menu-item-divider" />
        <SubMenu
          openOnHover={false}
          key="110"
          title={titleRight2}
        >
          <MenuItem key="231">inn</MenuItem>
          <SubMenu title={titleRight3}>
            <Menu>
              <MenuItem key="231">inner inner</MenuItem>
              <MenuItem key="242">inner inner2</MenuItem>
            </Menu>
          </SubMenu>
        </SubMenu>
      </SubMenu>
      <MenuItem disabled>disabled</MenuItem>
      <MenuItem key="2311">outer3</MenuItem>
    </Menu>
  );
  React.render(<div><h1>multiple selectable menu</h1><div style={{width:400}}>{leftMenu}</div></div>, container);
}
