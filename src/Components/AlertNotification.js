import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { loadAlerts, updateAlertStatus } from '../Utils/alertHelpers';
import { showNotification } from './Notifications';

const Container = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 10000;
`;

const Card = styled.div`
  background: #303032;
  color: white;
  padding: 12px 16px;
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
`;

const Button = styled.button`
  background: none;
  border: 1px solid #444;
  color: #fff;
  padding: 6px 8px;
  border-radius: 6px;
  margin-left: 8px;
`;

const AlertNotification = ({ triggeredAlerts = [] }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // load details of triggered alerts from storage
    (async () => {
      const all = await loadAlerts();
      const flat = [];
      for (const coin in all) {
        all[coin].forEach(a => {
          if (triggeredAlerts.includes(a.id)) flat.push(a);
        });
      }
      setAlerts(flat);
    })();
  }, [triggeredAlerts]);

  const dismiss = async (id) => {
    await updateAlertStatus(id, 'dismissed');
    setAlerts(prev => prev.filter(a => a.id !== id));
    showNotification('info', 'Alert dismissed');
  };

  const markSeen = async (id) => {
    await updateAlertStatus(id, 'triggered');
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (!alerts.length) return null;

  return (
    <Container>
      {alerts.map(a => (
        <Card key={a.id}>
          <div><b>{a.coin}</b> {a.type === 'above' ? '≥' : '≤'} {a.targetPrice}</div>
          <div style={{ marginTop: 8 }}>Status: {a.status}</div>
          <div style={{ marginTop: 8 }}>
            <Button onClick={() => markSeen(a.id)}>Acknowledge</Button>
            <Button onClick={() => dismiss(a.id)}>Dismiss</Button>
          </div>
        </Card>
      ))}
    </Container>
  );
};

export default AlertNotification;
