import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActionSelector from '../components/ActionSelector';
import { getLoginRoute, ROUTES } from '../../../utils/navigation';

const FaithfulActionScreen = () => {
  const navigate = useNavigate();

  const handleActionSelect = (action) => {
    if (action === 'login') {
      navigate(getLoginRoute('faithful', null, true));
    } else if (action === 'register') {
      navigate(getLoginRoute('faithful', null, false));
    }
  };

  return (
    <ActionSelector
      title="Acceso para Fieles"
      description="¿Tienes una cuenta o necesitas crear una nueva?"
      onActionSelect={handleActionSelect}
      onBack={() => navigate(ROUTES.SELECT_ROLE)}
    />
  );
};

export default FaithfulActionScreen;