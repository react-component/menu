# rc-menu@1.0.0
---

<link href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.css" rel="stylesheet" />
<link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.css" rel="stylesheet" />
<link href="/assets/index.css" rel="stylesheet" />
<style>
  .nav-sidebar{
    background-color: #f7f7f7;
  }
  .nav-sidebar > .active > a,
  .nav-sidebar > .active > a:hover,
  .nav-sidebar > .active > a:focus {
    color: #fff;
    background-color: #428bca;
  }
</style>

````js
if(window.seajs){
    window.require = seajs.use;
}
````
--------

## demo

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

  <!-- content -->
  <div class="col-sm-6 col-md-8">
    <b>this is full version and contains js.</b>
  </div>

  <!-- right -->
  <div id="rightMenu" class="col-sm-3 col-md-2"></div>

</div>





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
  <Menu className="nav navbar-nav" activeKey="1">
    <MenuItem eventKey="01" href="##" title="xx" onSelect={handleSelect} >outer</MenuItem>
    <MenuItem eventKey="1" href="##" title="xx" onSelect={handleSelect} >outer</MenuItem>
    <MenuItem eventKey="01" href="##" title="xx" onSelect={handleSelect} >outer</MenuItem>

    <SubMenu
      eventKey="111"
      title={titleDown}
      className="dropdown"
      buttonClass="dropdown-toggle"
      data-toggle="dropdown"
      role="button"
      aria-expanded="false"
      >

      <Menu className="dropdown-menu dropdown-menu-right" activeKey="111">

        <MenuItem ref="mItem0" eventKey="11">inner</MenuItem>
        <MenuItem divider />

        <SubMenu className="dropdown-submenu" title={titleRight}>

          <Menu className="dropdown-menu">
            <MenuItem eventKey="2">inner inner</MenuItem>
            <MenuItem eventKey="2">inner inner2</MenuItem>

          </Menu>
        </SubMenu>
      </Menu>
    </SubMenu>
  </Menu>
);
React.render(topMenu, document.querySelector('#topMenu'));


````