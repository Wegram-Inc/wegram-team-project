# Product Key Components Backup

This file contains the product key related components that were removed from the main app but saved for potential future use.

## Files to restore if needed:

### 1. ProductKeyFooter Component
**File:** `src/components/Layout/ProductKeyFooter.tsx`

```tsx
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
```

### 2. App.tsx Integration
**File:** `src/App.tsx` - Add these lines:

```tsx
// Import
import { ProductKeyFooter } from './components/Layout/ProductKeyFooter';

// In AppContent component, add this line after BottomNav:
{!hideTopNav && <ProductKeyFooter />}
```

### 3. ProductKeyModal Component
**File:** `src/components/ProductKeyModal.tsx` - Keep this file as is (it's already saved)

### 4. useTrialMode Hook
**File:** `src/hooks/useTrialMode.ts` - Keep this file as is (it's already saved)

## Instructions to Restore:

1. Uncomment the ProductKeyFooter import in App.tsx
2. Uncomment the ProductKeyFooter component usage in App.tsx
3. The ProductKeyModal.tsx and useTrialMode.ts files should remain untouched

## Notes:
- The ProductKeyFooter appears as a fixed button at the bottom of the screen
- It's hidden on chat-style pages to avoid overlap
- The modal handles product key entry and validation
- Trial mode functionality is preserved in the useTrialMode hook
