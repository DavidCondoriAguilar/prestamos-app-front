import React from 'react';
import { FaExclamationTriangle, FaSync } from 'react-icons/fa';
import { Card, Badge, Button, Spinner } from 'react-bootstrap';

const MoraSummaryCard = ({ 
  title = 'Préstamos en Mora', 
  count = 0, 
  amount = 0, 
  isLoading = false,
  onRefresh,
  className = ''
}) => {
  return (
    <Card className={`shadow-sm h-100 ${className}`}>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title text-muted mb-0 d-flex align-items-center">
            <FaExclamationTriangle className="text-warning me-2" />
            {title}
          </h5>
          <Badge bg="danger" pill>
            {isLoading ? <Spinner animation="border" size="sm" /> : count}
          </Badge>
        </div>
        
        <div className="mt-auto">
          <h2 className="mb-3">
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN'
              }).format(amount)
            )}
          </h2>
          
          {onRefresh && (
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
            >
              <FaSync className={`me-1 ${isLoading ? 'fa-spin' : ''}`} />
              {isLoading ? 'Actualizando...' : 'Actualizar'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MoraSummaryCard;
