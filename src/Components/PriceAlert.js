import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { makeAlert, loadAlerts, saveAlerts } from '../Utils/alertHelpers';
import { showNotification } from './Notifications';

const Form = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #222;
  color: white;
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #222;
  color: white;
`;

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #21ce99, #00d4aa);
  border: none;
  color: white;
  cursor: pointer;
`;

const PriceAlert = ({ coin, onSaved }) => {
  const [target, setTarget] = useState('');
  const [type, setType] = useState('above');

  useEffect(() => {
    setTarget('');
  }, [coin]);

  const save = async () => {
    if (!target || Number(target) <= 0) return showNotification('error', 'Enter a valid price');
    const alertObj = makeAlert({ coin, targetPrice: Number(target), type });
    const alerts = await loadAlerts();
    const list = alerts[coin.toUpperCase()] || [];
    alerts[coin.toUpperCase()] = [...list, alertObj];
    await saveAlerts(alerts);
    showNotification('success', `Alert saved for ${coin.toUpperCase()}`);
    setTarget('');
    if (onSaved) onSaved(alertObj);
  };

  return (
    <Form>
      <Input type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="Target price" />
      <Select value={type} onChange={e => setType(e.target.value)}>
        <option value="above">Above</option>
        <option value="below">Below</option>
      </Select>
      <Button onClick={save}>Set Alert</Button>
    </Form>
  );
};

export default PriceAlert;
