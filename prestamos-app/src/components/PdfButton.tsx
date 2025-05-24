import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';
import { PdfViewer } from './PdfViewer';

type PdfButtonProps = {
  clientId: string | number;
  clientName: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconOnly?: boolean;
  children?: React.ReactNode;
};

export const PdfButton = ({
  clientId,
  clientName,
  variant = 'primary',
  size = 'md',
  className = '',
  iconOnly = false,
  children,
}: PdfButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    ghost: 'bg-transparent hover:bg-gray-800 text-blue-400 hover:text-blue-300',
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-all ${sizeClasses[size]} ${variantClasses[variant]} ${iconOnly ? '!p-2' : ''} ${className}`}
        title={iconOnly ? `Ver reporte de ${clientName}` : undefined}
      >
        {children || (
          <>
            <FiFileText className={!iconOnly ? 'mr-2' : ''} />
            {!iconOnly && 'Ver Reporte'}
          </>
        )}
      </motion.button>

      {isOpen && (
        <PdfViewer
          clientId={clientId}
          clientName={clientName}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

// Example usage:
/*
import { PdfButton } from './components/PdfButton';

// In your component:
<PdfButton 
  clientId={123} 
  clientName="Juan Pérez" 
  variant="primary"
  size="md"
  className="mt-4"
/>
*/

// In a table row:
/*
{clients.map((client) => (
  <tr key={client.id}>
    <td>{client.name}</td>
    <td>{client.email}</td>
    <td className="text-right">
      <PdfButton 
        clientId={client.id} 
        clientName={client.name}
        variant="ghost"
        size="sm"
      />
    </td>
  </tr>
))}
*/
