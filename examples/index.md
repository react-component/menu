# rc-menu@2.x
---

## demo

<link href="../assets/index.css" rel="stylesheet" />
<link href="./index.css" rel="stylesheet" />

<style>
.menu-container{
  margin: 20px 40px;
}
</style>



<div id="container" class="menu-container" style='overflow:hidden'>
<div style='float:left;width:400px'>
single select
<div id='single' style='width:200px'>
</div>
</div>
<div style='float:left;width:400px'>
multiple select
<div id='multiple' style='width:200px'>
</div>
</div>
</div>


````js
var React = require('react');
var Menu = require('../');
var SubMenu = Menu.SubMenu;
var MenuItem = Menu.Item;

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
var multiple = document.getElementById('multiple');
var single = document.getElementById('single');

render(false,single);
render(true,multiple);

function render(multiple,container){
  var leftMenu = (
    <Menu activeKey="11110" multiple={multiple} onSelect={handleSelect} onDeselect={handleDeselect}>
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
  React.render(leftMenu, container);
}
````