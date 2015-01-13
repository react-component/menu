# rc-menu@1.0.0
---
````html
<link href="https://a.alipayobjects.com/bootstrap/3.3.1/css/bootstrap.css" rel="stylesheet" />
<link href="./bootstrap.css" rel="stylesheet" />
<style>
.active > a{
  background-color: #8EC8F9 !important;
}
.nav-sidebar{
  background-color: #f7f7f7;
}
</style>


<div class="container">
  <!-- top -->
  <nav class="navbar navbar-default" role="navigation">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">project</a>
    </div>
    <div id="topMenu" class="collapse navbar-collapse"></div>
  </nav>
  <!-- left -->
  <div id="leftMenu" class="col-sm-3 col-md-2"></div>
</div>
````


--------


````js
/** @jsx React.DOM */
var React = require('react');
var Menu = require('../');
var SubMenu = require('../lib/SubMenu');
var MenuItem = require('../lib/MenuItem');


function handleSelect(selectedKey) {
  alert('selected ' + selectedKey);
}

var titleDown = <span>sub menu <i className="fa fa-caret-down"></i></span>;
var titleRight = <span>sub menu <i className="fa fa-caret-right pull-right"></i></span>;

var topMenu = (
  <Menu className="nav navbar-nav" activeKey="10" canFocus={true} onSelect={handleSelect}>
    <MenuItem eventKey="31" href="http://www.alipay.com" >click to alipay</MenuItem>
    <MenuItem disabled eventKey="41" title="xx" onSelect={handleSelect} >disabled</MenuItem>
    <MenuItem eventKey="51" title="xx" onSelect={handleSelect} >outer2</MenuItem>

    <SubMenu
      openWhenHover={false}
      eventKey="110"
      title={<span>click to show <i className="fa fa-caret-down"></i></span>}
      className="dropdown"
      buttonClass="dropdown-toggle"
      data-toggle="dropdown"
      >
      <Menu className="dropdown-menu">
        <MenuItem eventKey="231">inn</MenuItem>
        <MenuItem eventKey="243">inner inner2</MenuItem>

        <SubMenu className="dropdown-submenu" title={titleRight}>

          <Menu className="dropdown-menu">
            <MenuItem eventKey="231">inner inner</MenuItem>
            <MenuItem eventKey="242">inner inner2</MenuItem>
          </Menu>

        </SubMenu>
      </Menu>
    </SubMenu>

    <MenuItem eventKey="2311">outer3</MenuItem>

    <SubMenu
      eventKey="101"
      title={titleDown}
      className="dropdown"
      buttonClass="dropdown-toggle"
      data-toggle="dropdown"
      role="button"
      aria-expanded="false"
      >

      <Menu
        className="dropdown-menu dropdown-menu-right"
        activeKey="112" >

        <MenuItem eventKey="11">ddd</MenuItem>

        <SubMenu className="dropdown-submenu" title={titleRight}>

          <Menu className="dropdown-menu">
            <MenuItem eventKey="231">inner inner</MenuItem>
            <MenuItem eventKey="242">inner inner2</MenuItem>
          </Menu>

        </SubMenu>

        <MenuItem divider />

        <SubMenu className="dropdown-submenu" title={titleRight}>
          <Menu className="dropdown-menu">
            <MenuItem eventKey="23">inner inner</MenuItem>
            <MenuItem eventKey="24">inner inner2</MenuItem>
          </Menu>
        </SubMenu>
      </Menu>
    </SubMenu>
  </Menu>
);
React.render(topMenu, document.querySelector('#topMenu'));





var leftMenu = (
  <Menu className="nav nav-sidebar" activeKey="10" canFocus={true}>
    <MenuItem eventKey="31" href="http://www.baidu.com" >outer</MenuItem>
    <MenuItem disabled>disabled</MenuItem>
    <li><a href="">not right MenuItem</a></li>
    <SubMenu className="dropdown-submenu" title={titleRight}>

      <Menu className="dropdown-menu">
        <MenuItem eventKey="231">inner inner</MenuItem>
        <MenuItem eventKey="242">inner inner2</MenuItem>

        <SubMenu
          openWhenHover={false}
          eventKey="110"
          title={<span>click to show <i className="fa fa-caret-down"></i></span>}
          className="dropdown"
          buttonClass="dropdown-toggle"
          data-toggle="dropdown"
          >
          <Menu className="dropdown-menu">
            <MenuItem eventKey="231">inn</MenuItem>
            <MenuItem eventKey="243">inner inner2</MenuItem>

            <SubMenu className="dropdown-submenu" title={titleRight}>

              <Menu className="dropdown-menu">
                <MenuItem eventKey="231">inner inner</MenuItem>
                <MenuItem eventKey="242">inner inner2</MenuItem>
              </Menu>

            </SubMenu>
          </Menu>
        </SubMenu>
      </Menu>
    </SubMenu>

    <SubMenu className="dropdown-submenu" title={titleRight}>
      <Menu className="dropdown-menu">
        <MenuItem eventKey="23">inner inner</MenuItem>
        <MenuItem eventKey="24">inner inner2</MenuItem>
      </Menu>
    </SubMenu>
    <MenuItem eventKey="2311">outer3</MenuItem>

  </Menu>
);
React.render(leftMenu, document.querySelector('#leftMenu'));


````