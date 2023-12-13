import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react'

import './index.css';
import App from './App';

import ChatProvider from './Context/ChatProvider';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </Router>
);


//  file in which backend url is present 
//   D:\realtimechatapp\client\src\components\authentication\Login.js
//   D:\realtimechatapp\client\src\components\authentication\Signup.js
//   D:\realtimechatapp\client\src\components\miscellaneous\GroupChatModal.js
//   D:\realtimechatapp\client\src\components\miscellaneous\SideDrawer.js
//   D:\realtimechatapp\client\src\components\miscellaneous\UpdateGroupChatModal.js
//   D:\realtimechatapp\client\src\components\MyChats.js
//   D:\realtimechatapp\client\src\components\SingleChat.js


