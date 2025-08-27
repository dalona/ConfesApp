import React from 'react';
import ActionSelector from '../components/ActionSelector';

const FaithfulActionScreen = ({ onActionSelect, onBack }) => {
  return (
    <ActionSelector
      title="Acceso para Fieles"
      description="¿Tienes una cuenta o necesitas crear una nueva?"
      onActionSelect={onActionSelect}
      onBack={onBack}
    />
  );
};

export default FaithfulActionScreen;