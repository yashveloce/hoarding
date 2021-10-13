import { Divider } from "@material-ui/core";
import React, { useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Navbar from './Navbar';

import { GridMenuIcon } from "@material-ui/data-grid";
import Employee_Master from './NavItems/Employee_Master';
import Location_Master from './NavItems/Location_Master';
import Customer_Master from './NavItems/Customer_Master';
import Media_Type_Master from './NavItems/Media_Type_Master';
import Size_Master from './NavItems/Size_Master';
import Industry_Master from './NavItems/Industry_Master';
import GST_Type_Master from './NavItems/GST_Type_Master';
import Labour_Master from './NavItems/Labour_Master';
import Dashboard from './NavItems/Dashboard';

// import { MenuOpen } from "@material-ui/icons";

const Body = () => {
  const history = useHistory();
  const homeRedirect = () => {
    history.push('/')
  }

  const [menu, setMenu] = useState(false);
  const menu_toggle = () => {
    let a = document.getElementById('sidebar');
    let b = document.getElementById('main');
    if (menu) {
      a.style.display = 'none';
      b.className = 'col-md-12 main';
      setMenu(false);
    } else {
      a.style.display = 'block';
      b.className = 'col-md-10 main';
      setMenu(true);
    }

  }
  return (
    <div>
      <header className="header" id="header" >
        <div className="header_toggle row"> 
          <GridMenuIcon className='col' style={{marginTop: '10px'}} onClick={menu_toggle}/> 
          {/* <MenuOpen className='col' style={{marginTop: '10px'}} /> */}
          <h2 className='col-11' style={{ cursor: 'pointer',}} onClick={homeRedirect}>
            BHARTI EXPO-ADS
          </h2>
        </div>
          <Divider />
        {/* <div className="header_img"> <img src="https://i.imgur.com/hczKIze.jpg" alt="" /> </div> */}
      </header>
      <div className='row' style={{margin: '0px',}}>

        <div className="col-md-2 sidenav" id='sidebar' style={{ padding: 0, minHeight: '100vh', position: 'sticky',  }}>
          <Navbar />
        </div>
        <div className="col-md-10 main" id='main'>


          <Switch>
          <Route exact path ='/Dashboard' component={Dashboard}/>
          <Route exact path ='/Employee_Master' component={Employee_Master}/>
          <Route exact path ='/Labour_Master' component={Labour_Master}/>
          <Route exact path ='/Location_Master' component={Location_Master}/>
          <Route exact path ='/Customer_Master' component={Customer_Master}/>
          <Route exact path ='/Media_Type_Master' component={Media_Type_Master}/>
          <Route exact path ='/Size_Master' component={Size_Master}/>
          <Route exact path ='/Industry_Master' component={Industry_Master}/>
          <Route exact path ='/GST_Type_Master' component={GST_Type_Master}/>
          </Switch>
        </div>
      </div>

    </div>
  );
}

export default Body;