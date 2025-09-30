import React, { useState } from 'react';
import { Key } from 'lucide-react';
import { ProductKeyModal } from '../ProductKeyModal';

export const ProductKeyFooter: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-16 left-0 right-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: 'var(--card)',
              color: 'var(--text)',
              border: '1px solid var(--border)'
            }}
          >
            <Key className="w-4 h-4" />
            Enter Product Key
          </button>
        </div>
      </div>

      <ProductKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
