import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../styles/style.css';
import LogoImg from '../images/logo.png';
import SearchImg from '../images/search.png';
import CartImg from '../images/cart.png';
import Member from '../images/member.png';
// eslint-disable-next-line import/no-cycle
import { AppContext } from '../views/App';

const NavLink = styled(Nav.Link)`
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: normal;
letter-spacing: ${(props) => (props.id === 'mobile' ? '10px' : '30px')};
text-align: left;
align-items: center;
font-size: 20px;
color: ${(props) => (props.id === 'mobile' ? '#828282' : '')};
:focus,:hover{
  color: ${(props) => (props.id === 'mobile' ? '#ffffff' : '')};
}
`;
const SeperationLine = styled.p`
font-size: 20px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: normal;
letter-spacing: 30px;
color: #3f3a3a;
padding-top: 16px;
`;
const BaseLine = styled.div`
height: 40px;
background-color: #313538;
`;
const Search = styled.input`
padding: 1px;
margin-top: 15px;
margin-bottom: 12px;
padding-left: 10px;
padding-right: 30px;
max-width: 184px;
height: 30px;
border-radius: 15px;
border: solid 1px #979797;
`;
const SearchIcon = styled.img`
position: relative;
left: -35px;
top: -2px;
width: 30px;
margin-right: 12px;
cursor: pointer;
`;
const Icon = styled.img`
width: 35px;
height: 35px;
margin-top: 11px;
margin-right: 38px;
cursor: pointer;
`;

const Container = styled.div`
width: auto;
`;
const CartNumContainer = styled.div`
position: relative;
left: -55px;
bottom: -5px;
width:22px;
height:auto;
border-radius: 100%;
border: 1px;
font-size: 16px;
color: #8b572a;
background-color: #eca2a2;
visibility: ${(prop) => (prop.cartnum === 0 ? 'hidden' : '')};
cursor: pointer;
`;
function Header() {
  const [cartNum, setCartNum] = useState(0);
  const { cartUpdateFlag } = useContext(AppContext);
  useEffect(
    () => {
      let localCart = JSON.parse(localStorage.getItem('cart'));
      if (!Array.isArray(localCart)) {
        localStorage.setItem('cart', '[]');
        localCart = [];
      }
      setCartNum(localCart.length || 0);
    },
    [cartUpdateFlag],
  );
  return (
    <Container>
      <Navbar className="mx-5 d-sm-flex justify-content-center " expand="md">
        <LinkContainer to="/">
          <Navbar.Brand className="me-5">
            <img
              src={LogoImg}
              alt="Logo"
              width="258px"
              height="48px"
            />
          </Navbar.Brand>
        </LinkContainer>
        <Nav className="me-auto ms-5  d-sm-none d-md-flex">
          <LinkContainer to="/category/women">
            <NavLink className="py-3" eventKey="#women">
              女裝
            </NavLink>
          </LinkContainer>

          <SeperationLine>|</SeperationLine>
          <LinkContainer to="/category/men">
            <NavLink className="py-3" eventKey="#men">
              男裝
            </NavLink>
          </LinkContainer>

          <SeperationLine>|</SeperationLine>
          <LinkContainer to="/category/accessories">
            <NavLink className="py-3" eventKey="#acc">
              配件
            </NavLink>
          </LinkContainer>
        </Nav>
        <Nav>
          <div>
            <Search name="product" />
            <SearchIcon src={SearchImg} alt="search" />
          </div>
          <div className="d-flex flex-row  justify-content-center">
            <LinkContainer to="/cart">
              <div className="d-flex justify-content-center align-items-start">
                <Icon src={CartImg} />
                <CartNumContainer cartnum={cartNum} className="d-flex justify-content-center align-items-start">{cartNum}</CartNumContainer>
              </div>
            </LinkContainer>
            <LinkContainer to="/profile">
              <Icon src={Member} alt="member" className="stretched-link" />
            </LinkContainer>
          </div>
        </Nav>
      </Navbar>
      <BaseLine className="d-flex  justify-content-center">
        <Nav id="mobile" className=" ms-5 d-flex  d-none d-sm-flex d-md-none">
          <LinkContainer to="/category/women">
            <NavLink id="mobile" className="py-2" eventKey="#women">
              女裝
            </NavLink>
          </LinkContainer>
          <LinkContainer to="/category/men">
            <NavLink id="mobile" className="py-2" eventKey="#men">
              男裝
            </NavLink>
          </LinkContainer>
          <LinkContainer to="/category/accessories">
            <NavLink id="mobile" className="py-2" eventKey="#acc">
              配件
            </NavLink>
          </LinkContainer>
        </Nav>
      </BaseLine>
    </Container>
  );
}
export default Header;
