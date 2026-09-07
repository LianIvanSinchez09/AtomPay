import { useEffect } from 'react';
import Chatbot from './components/chatbot/Chatbot.tsx';
import Toolbar from './components/Sidebar/Toolbar.tsx';
import SecondarySidebar from './components/SecondarySidebar/SecondarySidebar.tsx';


const App = () => {
	return(
		<>
		<div className='flex'>
			<SecondarySidebar/>
			<Toolbar/>
		</div>
			<Chatbot/>
		</>
	)
};

export default App