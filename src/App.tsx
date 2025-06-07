import { useState} from 'react';
import GlowLine from './components/GlowLine';
import BitcoinIcon from './components/Icons/BitcoinIcon.svg';


function App() {
  const [price, setPrice] = useState(83554.35);
  const [change, setChange] = useState(20.56);
  const [percentChange, setPercentChange] = useState(0.02);

  return (
    <div className="w-screen h-screen bg-[#090909] flex items-center justify-center">
      <div className="w-fill bg-[#0B0C0C] rounded-4xl pb-2 cursor-pointer overflow-hidden">
        <div className="flex justify-between p-10 pb-6">
          <div className="flex flex-col gap-1.5">
            <div className="text-gray-400 text-sm font-medium">
              <span className="mr-1">BTC</span>
              <span className="mx-1 mr-1">·</span>
              <span className="mx-1">Bitcoin</span>
            </div>
            <div className="text-white text-3xl font-semibold">${price.toLocaleString()}</div>
            <div className="text-[#5DC57B] text-sm mt-1 font-medium">
              <span className='mr-1'>+${change.toFixed(2)}</span> 
              <span className="mx-1 mr-1 text-xs">▲</span>
              <span className="mx-1">{percentChange.toFixed(2)}%</span>
            </div>
          </div>
          <div className="w-12 h-12">
            <img src={BitcoinIcon} alt="Bitcoin Icon" />
          </div>
        </div>

        <GlowLine/>

      </div>
    </div>
  );
}

export default App;
