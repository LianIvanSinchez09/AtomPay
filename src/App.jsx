import { useEffect } from 'react';
import Chatbot from './components/chatbot/Chatbot.tsx';
import Toolbar from './components/Sidebar/Toolbar.tsx';
import AppRoutes from "./routes/AppRoutes";

const App = () => {
	return(
		
		<>
		<AppRoutes />
		<div className='flex'>
		</div>
			<Chatbot/>
			
		</>
		
	)
};

export default App