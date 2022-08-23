import React, { useState, useEffect, useContext } from 'react';
import { Container, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
// eslint-disable-next-line import/no-cycle
import { AppContext } from './App';
import '../styles/style.css';
import cartremove from '../images/cart-remove.png';

const CenterContainer = styled(Container)`
justify-content: center;
align-items: center;
`;
const CartHeader = styled.div`
  display:flex;
  padding-right:30px;
`;
const CartHeaderNumber = styled.div`
  flex-grow: 1;
  color: #3f3a3a;
  font-weight: bold;
`;
const CartHeaderQuantity = styled.div`
  width: 185px;
  display:flex;
  justify-content: center;
`;
const CartHeaderPrice = styled.div`
  display:flex;
  justify-content: center;
  width: 166px;
`;
const CartHeaderSubtotal = styled.div`
  width: 167px;
  display:flex;
  justify-content: center;
  
`;
const CartDelete = styled.div`
  display: block;
  width:44px;
`;
const CartItems = styled.div`
    border: solid 1px #979797;
    
`;
const CartItem = styled.div`
  padding: 40px 30px;
  display: flex;
  align-items: center;
`;
const CartItemDetail = styled.div`
  margin-left: 20px;
  flex-grow: 1;
  align-self: flex-start;
`;
const CartItemId = styled.div` 
  margin-top: 18px;
`;
const CartItemColor = styled.div`
  display:flex;
  align-items: center;
  margin-top: 22px;
`;
const ColorBox = styled.div`
  width: 24px;
  height: 24px;
  display: block;
  background-color: ${(prop) => (prop.color ? prop.color : 'transparent')};
`;
const CartItemSize = styled.div`
  margin-top: 10px;
`;
const CartItemQuantity = styled.div`
  width: 185px;
  margin-top: 20px;
  text-align: center;
  order: 2;
`;
const CartItemPrice = styled.div`
  width: 166px;
  margin-top: 20px;
  text-align: center;
  order: 2;
`;
const CartItemSubtotal = styled.div`
  width: 167px;
  margin-top: 20px;
  text-align: center;
  order: 2;
`;
const CartDeleteButton = styled.div`
  margin-top: 30px;
  text-align: center;
  order: 2;
  cursor: pointer;
`;
const Shipment = styled.div`
height: auto;
margin-top: 26px;
padding: 22px 22px 22px 30px;
display:flex;
align-items: center;
font-size: 14px;
line-height: 17px;
background-color:#E8E8E8;
`;
const ShipmentItem = styled.div`
  display:flex;
  margin-right : 82px;
  align-items: center;
  font-size: 16px;
  color: #3f3a3a;
`;
const Note = styled.div`
  font-size: 16px;
  margin-top:20px;
`;
const InfoInput = styled.input`
   width: 574px;
   order: 2;
   border: solid 1px grey;
   border-radius:8px;
   padding-left: 10px;
`;
const AddressForm = styled.div`
  max-width: 674px;
  font-size: 16px;
`;
const PayForm = styled.div`
   max-width: 674px;
   font-size: 16px;
`;
const FormTitle = styled.div`
  color: #3f3a3a;
  font-weight: bold;
`;
const FormFieldInput = styled.div`
  width: 574px;
  height: 30px;
  border-radius: 8px;
  border: solid 1px #979797;
  order: 2;
`;
const Total = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  align-items: end;
`;
const TotalPrice = styled.div`
  margin-top: 40px;
  width:240px;
`;
const CheckOutBtn = styled(Button)`
  width: 240px;
  height: 60px;
  margin-top: 50px;
  border: solid 1px #979797;
  background-color: black;
  color: white;
  font-size: 20px;
  letter-spacing: 4px;
  margin-left: auto;
  display: block;
`;
function GetTPDirect() {
  return new Promise((resolve, reject) => {
    const script = window.document.createElement('script');
    script.src = 'https://js.tappaysdk.com/tpdirect/v5.1.0';
    script.async = true;
    script.onload = () => {
      if (typeof window.TPDirect !== 'undefined') {
        resolve(window.TPDirect);
      } else {
        reject(new Error('failed to load TapPay sdk'));
      }
    };
    script.onerror = reject;
    window.document.body.appendChild(script);
  });
}

function UpdateTotal(subtotal) {
  return subtotal.reduce((prev, item) => prev + item.orderCounts * item.price, 0);
}

function Cart() {
  const navigate = useNavigate();
  const [localCart, setLoacalCart] = useState([]);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [time, setTime] = React.useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [TPDirect, setTPDirect] = useState();
  const { cartUpdateFlag, setCartUpdateFlag } = useContext(AppContext);

  const freight = 30;
  const token = window.localStorage.getItem('token');
  useEffect(() => {
    setLoacalCart(JSON.parse(window.localStorage.getItem('cart')));
  }, []);

  useEffect(() => {
    setTotalPrice(UpdateTotal(localCart));
  }, [localCart]);

  useEffect(() => {
    GetTPDirect().then((res) => {
      res.setupSDK(
        '12348',
        'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF',
        'sandbox',
      );
      res.card.setup({
        fields: {
          number: {
            element: '#card-number',
            placeholder: '**** **** **** ****',
          },
          expirationDate: {
            element: '#card-expiration-date',
            placeholder: 'MM / YY',
          },
          ccv: {
            element: '#card-ccv',
            placeholder: '後三碼',
          },
        },
        styles: {
          '.valid': {
            color: 'green',
          },
          '.invalid': {
            color: 'red',
          },
        },
      });
      setTPDirect(res);
    });
  }, []);
  useEffect(() => {

  }, [TPDirect]);
  const changeQuantity = (itemIndex, itemQuantity) => {
    const newCartItems = localCart.map((item, index) => (index === itemIndex
      ? {
        ...item,
        orderCounts: itemQuantity,
      }
      : item));
    console.log(newCartItems);
    setLoacalCart(newCartItems);
    window.localStorage.setItem('cart', JSON.stringify(newCartItems));
  };
  const checkout = () => {
    if (!token) {
      // eslint-disable-next-line no-alert
      window.alert('尚未登入將轉跳至登入畫面');
      navigate('/signin');
      return;
    }
    if (localCart.length === 0) {
      window.alert('尚未選購商品');
      return;
    }

    const recipient = {
      name,
      phone,
      email,
      address,
      time,
    };

    if (Object.values(recipient).some((value) => !value)) {
      window.alert('請填寫完整訂購資料');
      return;
    }

    if (!TPDirect.card.getTappayFieldsStatus().canGetPrime) {
      window.alert('付款資料輸入有誤');
      return;
    }

    TPDirect.card.getPrime((result) => {
      if (result.status !== 0) {
        window.alert('付款資料輸入有誤');
        return;
      }
      const data = {
        prime: result.card.prime,
        order: localCart,
        total: totalPrice,
        email,
        phone,
        name,
        address,

      };
      axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
      axios.defaults.headers.common.authorization = `Bearer ${token}`;
      axios
        .post('/api/1.0/orders', data)
        .then((response) => {
          if (response.status === 200) {
            alert(`付款成功\n訂單編號:${response.data.number}`);
            window.localStorage.setItem('cart', JSON.stringify([]));
            setLoacalCart([]);
            setCartUpdateFlag(!cartUpdateFlag);
            navigate('/');
          }
        })
        .catch((error) => {
          alert(error.response.data.description);
        });
    });
  };
  return (
    <CenterContainer className="mt-5">
      <CartHeader>
        <CartHeaderNumber>
          購物車(
          {localCart.length}
          )
        </CartHeaderNumber>
        <CartHeaderQuantity>數量</CartHeaderQuantity>
        <CartHeaderPrice>單價</CartHeaderPrice>
        <CartHeaderSubtotal>小計</CartHeaderSubtotal>
        <CartDelete />
      </CartHeader>

      <CartItems className="mt-3">
        {localCart.map((item, index) => (
          <CartItem key={item.name + item.orderCounts}>
            <Image src={item.photoURL} width="114px" height="165px" />
            <CartItemDetail>
              <div>{item.name}</div>
              <CartItemId>{String(item.baseID).padStart(8, 0)}</CartItemId>
              <CartItemColor>
                顏色｜
                <ColorBox color={item.color} />
              </CartItemColor>
              <CartItemSize>
                尺寸｜
                {item.size}
              </CartItemSize>
            </CartItemDetail>
            <CartItemQuantity>

              <select
                value={item.orderCounts}
                className="cart__item-quantity-selector"
                onChange={(e) => changeQuantity(index, e.target.value)}
              >
                {Array(item.stock)
                  .fill()
                  // eslint-disable-next-line no-shadow
                  .map((_, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={index}>{index + 1}</option>
                  ))}
              </select>
            </CartItemQuantity>
            <CartItemPrice>
              <div className="cart__item-price-content">
                NT.
                {item.price}
              </div>
            </CartItemPrice>
            <CartItemSubtotal>
              <div className="cart__item-subtotal-content">
                NT.
                {item.orderCounts * item.price}
              </div>
            </CartItemSubtotal>
            <CartDeleteButton onClick={() => {
              const newCartItems = localCart.filter(
                // eslint-disable-next-line no-shadow
                (_, i) => i !== index,
              );
              window.localStorage.setItem('cart', JSON.stringify(newCartItems));
              setLoacalCart(newCartItems);
              setCartUpdateFlag(!cartUpdateFlag);
            }}
            >
              <Image src={cartremove} />
            </CartDeleteButton>
          </CartItem>
        ))}
      </CartItems>
      <Shipment>
        <ShipmentItem>
          <div className="d-flex  me-3">配送國家</div>
          <select className="shipment__item-selector" defaultValue="taiwan">
            <option value="taiwan">臺灣及離島</option>
          </select>
        </ShipmentItem>
        <ShipmentItem>
          <div className="d-flex justify-content-center align-items-center me-3">付款方式</div>
          <select className="shipment__item-selector" defaultValue="credit_card">
            <option value="credit_card">信用卡付款</option>
          </select>
        </ShipmentItem>
      </Shipment>
      <Note>
        ※ 提醒您：
        <br />
        ● 選擇宅配-請填寫正確收件人資訊，避免包裹配送不達
        <br />
        ● 選擇超商-請填寫正確收件人姓名(與證件相符)，避免無法領取
        <br />
      </Note>
      <div className="form mt-5">
        <FormTitle className=" border-bottom pb-3 mb-5">訂購資料</FormTitle>
        <AddressForm>
          <div>
            <div className="d-flex align-items-center justify-content-between ">
              <div className="me-3">收件人姓名</div>
              <InfoInput
                className="form__field-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="text-end text-primary mt-2">
              務必填寫完整收件人姓名，避免包裹無法順利簽收
            </div>
          </div>

          <div className="d-flex align-items-center  justify-content-between mt-5 ">
            <div className="me-3">Email</div>
            <InfoInput
              className="form__field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center  justify-content-between mt-5">
            <div className="form__field-name">手機</div>
            <InfoInput
              className="form__field-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center  justify-content-between mt-5">
            <div className="form__field-name">地址</div>
            <InfoInput
              className="form__field-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center  mt-5">
            <div className="form__field-name me-5">配送時間</div>
            <div className="form__field-radios" id="delivery">
              <label htmlFor="morning" className="form__field-radio me-5 ">
                <input
                  type="radio"
                  id="morning"
                  checked={time === 'morning'}
                  onChange={(e) => {
                    if (e.target.checked) setTime('morning');
                  }}
                />
                {' '}
                08:00-12:00
              </label>
              <label htmlFor="afternoon" className="form__field-radio me-5">
                <input
                  type="radio"
                  id="afternoon"
                  checked={time === 'afternoon'}
                  onChange={(e) => {
                    if (e.target.checked) setTime('afternoon');
                  }}
                />
                {' '}
                14:00-18:00
              </label>
              <label htmlFor="不指定" className="form__field-radio me-5 ">
                <input
                  type="radio"
                  id="anytime"
                  checked={time === 'anytime'}
                  onChange={(e) => {
                    if (e.target.checked) setTime('anytime');
                  }}
                />
                {' '}
                不指定
              </label>
            </div>
          </div>
        </AddressForm>

      </div>
      <div className=" border-bottom pb-5 ">
        <FormTitle className=" border-bottom pb-3 mb-5 mt-5">付款資料</FormTitle>
        <PayForm className="form  mt-5">
          <div className="d-flex align-items-center  justify-content-between  mt-5 ">
            <div className="form__field-name">信用卡號碼</div>
            <FormFieldInput className="form__field-input ps-2" id="card-number" />
          </div>
          <div className="d-flex align-items-center  justify-content-between  mt-5">
            <div className="form__field-name">有效期限</div>
            <FormFieldInput className="form__field-input ps-2" id="card-expiration-date" />
          </div>
          <div className="d-flex align-items-center justify-content-between  mt-5">
            <div className="form__field-name">安全碼</div>
            <FormFieldInput className="form__field-input ps-2" id="card-ccv" />
          </div>
        </PayForm>
      </div>

      <div className="d-flex justify-content-end">
        <Total>
          <TotalPrice className="d-flex justify-content-between total">
            <div className="total__name">總金額</div>
            <div className="d-flex">
              <div className="total__nt">NT.</div>
              <div className="total__amount">{totalPrice}</div>
            </div>
          </TotalPrice>
          <TotalPrice className="d-flex justify-content-between border-bottom pb-3  freight">
            <div className="freight__name ">運費</div>
            <div className="d-flex">
              <div className="total__nt me-2">NT.</div>
              <div className="total__amount">{freight}</div>
            </div>

          </TotalPrice>
          <TotalPrice className="d-flex  justify-content-between payable">
            <div className="payable__name">應付金額</div>
            <div className="d-flex">
              <div className="total__nt">NT.</div>
              <div className="total__amount">{totalPrice + freight}</div>
            </div>
          </TotalPrice>
          <CheckOutBtn className="mb-5" onClick={() => { checkout(); }}>
            確認付款
          </CheckOutBtn>
        </Total>
      </div>

    </CenterContainer>
  );
}
export default Cart;
