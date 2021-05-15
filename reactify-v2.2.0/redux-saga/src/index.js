import React from 'react';
import ReactDOM from 'react-dom';
const rootEl = document.getElementById("root");
import { hot } from 'react-hot-loader/root'
import CustomConfig from 'Constants/custom-config';
let render = () => {
   googleMapApi();
  // Dynamically import our main App component, and render it
  const MainApp = require('./App').default;
  ReactDOM.render(
    <MainApp />,
    rootEl
  );
};

if (hot) {
  hot(() => {
    const NextApp = require('./App').default;
    render(
      <NextApp />,
      rootEl
    );
  });
}


let googleMapApi = () =>
     {
       

        
         var link6 = document.createElement('link');
          link6.rel = 'stylesheet';
         link6.href =  CustomConfig.serverUrl + "material-design-iconic-font/material-design-iconic-font.min.css" ;
         link6.async = true;
         link6.defer = true;
         document.head.appendChild(link6);




         var link7 = document.createElement('link');
          link7.rel = 'stylesheet';
         link7.href =  CustomConfig.serverUrl + "font-awesome/font-awesome.min.css" ;
         link7.async = true;
         link7.defer = true;
         document.head.appendChild(link7);

  

     };





render();
