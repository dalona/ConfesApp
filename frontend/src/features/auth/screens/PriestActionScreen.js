import React from 'react';
import ActionSelector from '../components/ActionSelector';

const PriestActionScreen = ({ onActionSelect, onBack }) => {
  return (
    <ActionSelector
      title="Acceso para Sacerdotes"
      description="¿Tienes una cuenta o necesitas registrarte?"
      onActionSelect={onActionSelect}
      onBack={onBack}
    />
  );
};

export default PriestActionScreen;