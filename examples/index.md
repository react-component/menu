# rc-menu@2.x
---

## demo

<link href="../assets/index.css" rel="stylesheet" />
<link href="./index.css" rel="stylesheet" />

<style>
.menu-container{
  margin: 20px 40px;
  width: 170px;
}
</style>

````html
<div id="leftMenu" class="menu-container"></div>

````

````js
var React = require('react');
var Menu = require('../');
var SubMenu = Menu.SubMenu;
var MenuItem = Menu.Item;

function handleSelect(selectedKey) {
  console.log('selected ' + selectedKey);
}

var titleRight = <span>sub menu <i className="fa fa-caret-right pull-right"></i></span>;

var leftMenu = (
  <Menu activeKey="10" onSelect={handleSelect}>
    <MenuItem key="10">1</MenuItem>
    <MenuItem key="31">outer</MenuItem>
    <SubMenu title={titleRight}>
        <MenuItem key="31">inner inner</MenuItem>
        <MenuItem disabled className="rc-menu-item-divider" />
        <SubMenu
          openWhenHover={false}
          key="110"
          title={titleRight}
          >
          <Menu>
            <MenuItem key="231">inn</MenuItem>
            <SubMenu title={titleRight}>
              <Menu>
                <MenuItem key="231">inner inner</MenuItem>
                <MenuItem key="242">inner inner2</MenuItem>
              </Menu>
            </SubMenu>
          </Menu>
        </SubMenu>
    </SubMenu>
    <MenuItem disabled>disabled</MenuItem>
    <MenuItem key="2311">outer3</MenuItem>
  </Menu>
);
React.render(leftMenu, document.querySelector('#leftMenu'));
````