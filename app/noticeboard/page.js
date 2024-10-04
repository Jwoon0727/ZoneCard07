'use client'
import ClientNavbar from '../components/ClientNavbar';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function JustifiedExample() {
  return (
    <div>
    <ClientNavbar/>

    <Tabs
      defaultActiveKey="profile"
      id="justify-tab-example"
      className="mb-3"
      justify
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
        Tab content for Loooonger Tab
      </Tab>
      <Tab eventKey="longer-tab2" title="Loooonger Tab2">
        Tab content for Loooonger Tab
      </Tab>
      <Tab eventKey="contact" title="Contact" >
        Tab content for Contact
      </Tab>
    </Tabs>
    </div>
  );
}

export default JustifiedExample;