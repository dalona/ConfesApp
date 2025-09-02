import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActionSelector from '../components/ActionSelector';
import { getLoginRoute, ROUTES } from '../../../utils/navigation';

const PriestActionScreen = () => {
  const navigate = useNavigate();

  const handleActionSelect = (action) => {
    if (action === 'login') {
      navigate(getLoginRoute('priest', null, true));
    } else if (action === 'register') {
      navigate(ROUTES.PRIEST_REGISTRATION_TYPE);
    }
  };

  return (
    <ActionSelector
      title="Acceso para Sacerdotes"
      description="¿Tienes una cuenta o necesitas registrarte?"
      onActionSelect={handleActionSelect}
      onBack={() => navigate(ROUTES.SELECT_ROLE)}
    />
  );
};

export default PriestActionScreen;