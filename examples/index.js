/** @jsx React.DOM */


var React = require('react');
var Menu = require('../');
var Dropdown = require('../lib/Dropdown');
var MenuItem = require('../lib/MenuItem');


function handleSelect(selectedKey) {
  alert('selected ' + selectedKey);
}

var titleDown = <span>sub menu <i className="fa fa-caret-down"></i></span>;
var titleRight = <span>sub menu <i className="fa fa-caret-right pull-right"></i></span>;

var topMenu = (
  <Menu className="navbar-nav" activeKey="1">
    <MenuItem eventKey="1" href="###" title="xx" onSelect={handleSelect} >xxx</MenuItem>
    <MenuItem eventKey="2">Another action</MenuItem>

    <Dropdown title={titleDown}>

      <MenuItem eventKey="1">Action</MenuItem>
      <MenuItem divider />
      <MenuItem eventKey="2">Another action</MenuItem>

      <Dropdown className="dropdown-submenu" title={titleRight}>
        <MenuItem eventKey="2">Another action</MenuItem>
        <MenuItem eventKey="3">Something else here</MenuItem>
      </Dropdown>

    </Dropdown>
  </Menu>
);
React.render(topMenu, document.querySelector('#topMenu'));

// leftMenu
var leftMenu = (
  <Menu className="nav-sidebar" activeKey="1">
    <MenuItem eventKey="1"> action</MenuItem>
    <MenuItem eventKey="2">Another action</MenuItem>

    <Dropdown className="dropdown-submenu" title={titleRight}>
      <MenuItem eventKey="2">Another action</MenuItem>
      <MenuItem eventKey="3">Something else here</MenuItem>

      <Dropdown className="dropdown-submenu" title={titleRight}>
        <MenuItem eventKey="2">Another action</MenuItem>
        <MenuItem eventKey="3">Something else here</MenuItem>
      </Dropdown>

    </Dropdown>
  </Menu>
)
React.render(leftMenu, document.querySelector('#leftMenu'));

//rightMenu
var titleLeft = <span>sub menu <i className="fa fa-caret-left pull-right"></i></span>;
var rightMenu = (
  <Menu className="nav-sidebar" activeKey="2">
    <MenuItem eventKey="1"> action</MenuItem>
    <MenuItem eventKey="2">Another action</MenuItem>

    <Dropdown className="dropdown-submenu pull-left" title={titleLeft}>
      <MenuItem eventKey="2">Another action</MenuItem>
      <MenuItem eventKey="3">Something else here</MenuItem>

      <Dropdown className="dropdown-submenu pull-left" title={titleLeft}>
        <MenuItem eventKey="2">Another action</MenuItem>
        <MenuItem eventKey="3">Something else here</MenuItem>
      </Dropdown>

    </Dropdown>
  </Menu>
)
React.render(rightMenu, document.querySelector('#rightMenu'));
