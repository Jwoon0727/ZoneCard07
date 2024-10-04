'use client'
import ClientNavbar from '../components/ClientNavbar';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useState } from 'react';

function JustifiedExample() {
  const [key, setKey] = useState('profile');

  return (
    <div>
      <ClientNavbar />

      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <Tabs
          id="justify-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
          style={{
            display: 'inline-flex',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          <Tab eventKey="home" title="Home">
            Tab content for Home
          </Tab>
          <Tab eventKey="profile" title="Profile">
            Tab content for Profile
          </Tab>
          <Tab eventKey="longer-tab" title="Loooonger Tab">
            Tab content for Loooonger Tab
          </Tab>
          <Tab eventKey="longer-tab1" title="Loooonger Tab1">
            Tab content for Loooonger Tab1
          </Tab>
          <Tab eventKey="longer-tab2" title="Loooonger Tab2">
            Tab content for Loooonger Tab2
          </Tab>
          <Tab eventKey="contact" title="Contact">
            Tab content for Contact
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default JustifiedExample;