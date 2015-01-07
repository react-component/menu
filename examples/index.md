# rc-menu@1.0.0
---
````html
<link href="/assets/vendor/bootstrap-3.1.1/css/bootstrap.css" rel="stylesheet" />
<link href="/assets/vendor/font-awesome-4.2.0/css/font-awesome.css" rel="stylesheet" />
<link href="/assets/index.css" rel="stylesheet" />

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
  <Menu className="nav navbar-nav" activeKey="10">
    <MenuItem eventKey="01" href="##" title="xx" onSelect={handleSelect} >outer</MenuItem>
    <MenuItem eventKey="1" href="##" title="xx" onSelect={handleSelect} >outer</MenuItem>
    <MenuItem eventKey="01" href="##" title="xx" onSelect={handleSelect} >outer</MenuItem>

    <SubMenu
      eventKey="110"
      title={titleDown}
      className="dropdown"
      buttonClass="dropdown-toggle"
      data-toggle="dropdown"
      >
      <Menu className="dropdown-menu">
        <MenuItem eventKey="231">inner inner</MenuItem>
        <MenuItem eventKey="243">inner inner2</MenuItem>
      </Menu>
    </SubMenu>
    <MenuItem eventKey="2311">inner inner</MenuItem>
    <SubMenu
      eventKey="10"
      title={titleDown}
      className="dropdown"
      buttonClass="dropdown-toggle"
      data-toggle="dropdown"
      role="button"
      aria-expanded="false"
      >

      <Menu className="dropdown-menu dropdown-menu-right" activeKey="112">

        <MenuItem eventKey="11">ddd</MenuItem>
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


````