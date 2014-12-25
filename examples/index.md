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



<script>
require('./index')
</script>


--------


````js
/** @jsx React.DOM */
require(['../','../lib/Dropdown','../lib/MenuItem', 'react'],
function(Menu,Dropdown, MenuItem ,React){

});
````