import { useState } from 'react';
import GlowLine from './components/GlowLine';
import BitcoinIcon from './components/Icons/BitcoinIcon.svg';

function App() {
  const [price, setPrice] = useState(83554.35);
  const [change, setChange] = useState(20.56);
  const [percentChange, setPercentChange] = useState(0.02);

  return (
    <div className="w-screen h-screen bg-[#090909] flex items-center justify-center">
      <div className="w-fill bg-[#0B0C0C] rounded-2xl shadow-lg">
        <div className="flex justify-between p-10 pb-6">
          <div className="flex flex-col gap-2">
            <div className="text-gray-400 text-sm">BTC · Bitcoin</div>
            <div className="text-white text-3xl font-bold">${price.toLocaleString()}</div>
            <div className="text-[#5DC57B] text-sm mt-1">
              +${change.toFixed(2)} 
              <span className="ml-1">▲ {percentChange.toFixed(2)}%</span>
            </div>
          </div>
          <div className="w-16 h-16">
            <img src={BitcoinIcon} alt="Bitcoin Icon" />
          </div>
        </div>

        <GlowLine />
      </div>
    </div>
  );
}

export default App;
