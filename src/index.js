import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import 'bootstrap/dist/css/bootstrap.min.css';
   import { Provider } from 'react-redux';
   import store from './redux/store';
   import 'bootstrap/dist/js/bootstrap.bundle.min.js';
   

   const root = ReactDOM.createRoot(document.getElementById('root'));
   root.render(
       <Provider store={store}>
           <React.StrictMode>
               <App />
           </React.StrictMode>
       </Provider>
   );
   