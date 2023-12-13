import { Routes, Route } from 'react-router-dom';

import './App.css';

import Homepage from './Pages/Homepage'
import ChatPage from './Pages/ChatPage'


function App() {
    return (
        <div className="App">
            <Routes>

                <Route path='/' element={<Homepage />} />
                <Route path='/chats' element={<ChatPage />} />
            </Routes>
        </div>
    );
}

export default App;


//  file in which backend url is present 
//   D:\realtimechatapp\client\src\components\authentication\Login.js
//   D:\realtimechatapp\client\src\components\authentication\Signup.js
//   D:\realtimechatapp\client\src\components\miscellaneous\GroupChatModal.js
//   D:\realtimechatapp\client\src\components\miscellaneous\SideDrawer.js
//   D:\realtimechatapp\client\src\components\miscellaneous\UpdateGroupChatModal.js
//   D:\realtimechatapp\client\src\components\MyChats.js
//   D:\realtimechatapp\client\src\components\SingleChat.js
//   
