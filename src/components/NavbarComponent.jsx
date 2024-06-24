import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

const NavbarComponent = () => {
  return (
    <Navbar className="nav">
      <Container>
        <Navbar.Brand className="text-white">IMAGE AND AUDIO PROCESSING</Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav bg-dark me-5">
          <Nav className="ms-auto">
            <div className="nav-link">
              <NavLink to={'/'}>Home</NavLink>
              <NavLink to={'/audio'}>Audio</NavLink>
              <NavLink to={'/video'}>Video</NavLink>
              <NavLink to={'/image'}>Image</NavLink>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
