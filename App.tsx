
import React, { useState } from 'react';
import IkeaCaptcha from './components/IkeaCaptcha';
import { CHAIR_DATA } from './constants';

const App: React.FC = () => {
  const [lastVerification, setLastVerification] = useState<boolean | null>(null);

  const handleVerify = (isSuccess: boolean) => {
    console.log(`Verification result: ${isSuccess ? 'Success' : 'Failure'}`);
    setLastVerification(isSuccess);
  };

  return (
    <div className="bg-slate-100 min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <IkeaCaptcha 
          furnitureData={CHAIR_DATA}
          onVerify={handleVerify}
        />
      </div>
    </div>
  );
};

export default App;