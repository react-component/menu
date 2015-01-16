# rc-menu@1.0.0
---

<style>
.active > a{
  background-color: #8EC8F9 !important;
}
</style>

### demo

````html
<link href="./index.css" rel="stylesheet" />
<style>
.menu-container{
  margin: 20px 40px;
  width: 170px;
}
</style>
<div id="leftMenu" class="menu-container"></div>

````

````js
var React = require('react'); 
var Menu = require('../').Menu;
var SubMenu = require('../').SubMenu;
var MenuItem = require('../').MenuItem;

function handleSelect(selectedKey) {
  alert('selected ' + selectedKey);
}

var titleRight = <span>sub menu <i className="fa fa-caret-right pull-right"></i></span>;

var leftMenu = (
  <Menu activeKey="10" onSelect={handleSelect}>
    <MenuItem key="10" onSelect={handleSelect}>onSelect</MenuItem>
    <MenuItem key="31" href="http://www.baidu.com" onSelect={handleSelect}>outer</MenuItem>
    <SubMenu title={titleRight}>
      <Menu>
        <MenuItem key="31">inner inner</MenuItem>
        <MenuItem divider />
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
      </Menu>
    </SubMenu>
    <MenuItem disabled>disabled</MenuItem>
    <MenuItem key="2311">outer3</MenuItem>
  </Menu>
);
React.render(leftMenu, document.querySelector('#leftMenu'));

````

--------

### bootstrap demo

````html
<link href="https://a.alipayobjects.com/bootstrap/3.3.1/css/bootstrap.css" rel="stylesheet" />
<style>
.override{
  border: 0;
}
.override > .dropdown > .dropdown-menu{
  top: 100%;
  left: 0;
}
</style>
<div class="container"> 
  <nav class="navbar navbar-default" role="navigation">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">project</a>
    </div>
    <div id="topMenu" class="collapse navbar-collapse"></div>
  </nav> 
</div>
````

````js
/** @jsx React.DOM */
var React = require('react');
var Menu = require('../').Menu;
var SubMenu = require('../').SubMenu;
var MenuItem = require('../').MenuItem;

var titleRight = <span>sub menu <i className="fa fa-caret-right pull-right"></i></span>;

var topMenu = (
  <Menu className="nav navbar-nav override" activeKey="10">
    <MenuItem key="51" title="xx">outer2</MenuItem>
    <SubMenu key="110" className="dropdown" openWhenHover={false}
      title={<span>click to show <i className="fa fa-caret-down"></i></span>}>
      
      <Menu className="dropdown-menu">
        <MenuItem key="231">inn</MenuItem>
        <SubMenu className="dropdown-submenu" title={titleRight}>
          <Menu className="dropdown-menu">
            <MenuItem key="231">inner inner</MenuItem>
            <MenuItem key="242">inner inner2</MenuItem>
          </Menu>
        </SubMenu>
      </Menu>
    </SubMenu>
    <MenuItem key="2311">outer3</MenuItem>
    <SubMenu key="101" className="dropdown" buttonClass="dropdown-toggle"
      title={<span>sub menu <i className="fa fa-caret-down"></i></span>}>
      
      <Menu className="dropdown-menu dropdown-menu-right" activeKey="112" >
        <MenuItem key="11">ddd</MenuItem>
        <SubMenu className="dropdown-submenu" title={titleRight}>

          <Menu className="dropdown-menu">
            <MenuItem key="231">inner inner</MenuItem>
            <MenuItem key="242">inner inner2</MenuItem>
          </Menu>
        </SubMenu>
        <MenuItem divider />
        <SubMenu className="dropdown-submenu" title={titleRight}>
          <Menu className="dropdown-menu">
            <MenuItem key="23">inner inner</MenuItem>
            <MenuItem key="24">inner inner2</MenuItem>
          </Menu>
        </SubMenu>
      </Menu>
    </SubMenu>
  </Menu>
);
React.render(topMenu, document.querySelector('#topMenu'));


````