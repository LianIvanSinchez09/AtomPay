import { useEffect } from 'react';
import Chatbot from './components/chatbot/Chatbot.tsx';
import SideBar from './components/SideBar.tsx';


const App = () => {
	return(
		<>
			<SideBar/>
			<Chatbot/>
		</>
	)
};

export default App