import React, {
  useState, useEffect, useContext,
} from 'react';
import {
  Image, Container, Row, Col, Button, Toast,
} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import SpinnerSVG from '../images/Spinner.svg';
import AmountInput from '../components/AmountInput';
import favicon from '../favicon.svg';
// eslint-disable-next-line import/no-cycle
import { AppContext } from './App';
import '../styles/style.css';

const Img = styled(Image)`
  max-width: ${(prop) => (prop.src === SpinnerSVG ? '200px' : '100%')};
  height: ${(prop) => (prop.src === SpinnerSVG ? '200px' : 'auto')};
`;
const ImgBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Title = styled.h1`
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 6.4px;
  color: #3f3a3a;
`;
const ID = styled.p`
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 4px;
  text-align: left;
  color: #bababa;
`;
const Prices = styled.h1`
  font-size: 30px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #3f3a3a;
`;
const P = styled.p`
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 4px;
  text-align: left;
  color: #3f3a3a;
  margin-bottom:0;
`;
const ColorBox = styled.label`
width: 24px;
height: 24px;
background-color: ${(prop) => (prop.color ? prop.color : 'transparent')};
border: 2px  solid;
border-color: ${(prop) => (prop.color === '#ffffff' ? '#111111' : 'transparent')};
margin-left: 28px;
cursor: pointer;
&:hover{
  padding :5px;
  border: 3px solid #2a2a2a;
}
`;
const SizeButton = styled.label`
display:flex;
justify-content: center;
align-items: center;
width: 34px;
height: 34px;
background-color: #ececec;
border-radius: 100%;
border: 1px;
margin-left: 22px;
color: #111;
cursor: pointer;
&:hover {
    background-color: #111;
    color: #fff;
}
`;
const AddCartButton = styled(Button)`
height: 60px;
padding: 0;
background-color: #000000;
color: #ffffff;
&:disabled{
  background-color: #565353;
}
`;
const CheckBoxNone = styled.input.attrs({ type: 'checkbox' })`
display: none;
&:checked ~ label
{ 
  padding :5px;
  border: 3px solid #2a2a2a;
  background-color: ${(props) => (props.id === 'size' ? '#111' : props.color)};
  color:${(props) => (props.id === 'size' ? '#fff' : props.color)};
}
`;
function Product() {
  const { id } = useParams();
  const [productData, setProductData] = useState({ product: [], spec: [{ counts: 0, color: '', size: '' }] });
  const [colorList, setColorList] = useState([]);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [counts, setCounts] = useState(0);
  const [toastToggle, setToastToggle] = useState(false);
  const sizeList = ['S', 'M', 'L', 'XL'];
  const { cartUpdateFlag, setCartUpdateFlag } = useContext(AppContext);
  const selectSpec = (() => {
    const selectItem = productData.spec.find((item) => item.color === color
    && item.size === size) || { counts: 0 };
    return parseInt(selectItem.counts, 10) || 0;
  });

  const getData = (productID) => {
    axios.get('/api/1.0/products/details', { params: { id: productID } })
      .then((response) => {
        setProductData(response.data);
        const colorArray = Array.from(response.data.spec).map((itme) => itme.color);
        setColorList(Array.from(new Set(colorArray)));
      }).catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getData(id);
  }, []);

  const productInfo = Array.from(productData.product).map((obj) => (
    <Row className=" d-flex flex-row justify-content-center" key={`${obj.id}`}>
      <Col className="mb-5 d-flex justify-content-center  align-items-start col-12 col-lg-6">
        <ImgBox>
          <Img className="img-fluid " src={obj.photoURL} />
        </ImgBox>
      </Col>
      <Col className="col-12 col-lg-4">
        <Container className="ms-2 px-0 d-flex flex-column  ">
          <div>
            <Title>{obj.name}</Title>
            <ID className="mt-3 pb-3">{String(obj.id).padStart(8, 0)}</ID>
            <Prices className="mt-3 pb-3">{`TWD.${obj.prices}`}</Prices>
          </div>
          <div className="mb-2 border-bottom border-2 border-dark" />
          <div className="mt-5  d-flex flex-column">

            <div className="mb-2 d-flex align-items-center ">
              <P className="pe-4 border-end border-2 border-lines">顏色</P>
              {
                  colorList.map((item) => (
                    <div key={item}>
                      <CheckBoxNone color={color} id="color" checked={color === item} readOnly />
                      <ColorBox
                        color={item}
                        onClick={(e) => { setColor(e.currentTarget.getAttribute('color')); }}
                        htmlFor="color"
                      />
                    </div>

                  ))
              }
            </div>
            <div className="d-flex  mt-5 mb-2 align-items-center ">
              <P className="pe-4 border-end border-2 border-lines">尺寸</P>
              {
                  sizeList.map((item) => (
                    <div key={item}>
                      <CheckBoxNone key={uuidv4()} id="size" checked={size === item} readOnly />
                      <SizeButton
                        onClick={(e) => { setSize(e.currentTarget.innerHTML); }}
                      >
                        {item}
                      </SizeButton>
                    </div>
                  ))
              }
            </div>
            <div className="d-flex  mt-5 mb-2 align-items-center ">
              <P className="pe-4 border-end border-2 border-lines">數量</P>
              <AmountInput
                maxNum={selectSpec()}
                counts={counts}
                setCounts={setCounts}
              />
            </div>
            <P key={uuidv4()} className="me-5 pe-5 d-flex justify-content-center">{color !== '' && size !== '' ? `(剩餘${selectSpec()}件)` : ''}</P>
            <AddCartButton
              className="mt-5 mb-2"
              onClick={() => {
                const spec = {
                  baseID: obj.id,
                  name: obj.name,
                  price: parseInt(obj.prices, 10),
                  photoURL: obj.photoURL,
                  color,
                  size,
                  orderCounts: parseInt(counts, 10),
                  stock: selectSpec(),
                };
                let localCart = JSON.parse(localStorage.getItem('cart'));
                if (!Array.isArray(localCart)) {
                  localStorage.setItem('cart', []);
                  localCart = [];
                }
                localCart.push(spec);
                localStorage.setItem('cart', JSON.stringify(localCart));
                setToastToggle(true);
                setCartUpdateFlag(!cartUpdateFlag);
              }}
              disabled={!!(color === '' || size === '' || counts === 0)}
            >
              加入購物車
            </AddCartButton>
            <div className="mt-3">
              <P>*實品顏色依單品照為主</P>
              <div>{String(obj.description).split('\n').map((str) => <P key={uuidv4()} className="mt-2">{str}</P>)}</div>
            </div>
          </div>
        </Container>
      </Col>
    </Row>
  ));

  return (
    <Container className="px-0 mt-5">
      {productInfo}
      <div className="position-fixed bottom-0 end-0 p-3">
        <Toast show={toastToggle} onClose={() => { setToastToggle(!toastToggle); }} delay={5000} autohide position="bottom-end'">
          <Toast.Header>
            <img
              src={favicon}
              className="rounded me-2"
              alt=""
              width="20px"
              height="20px"
            />
            <strong className="me-auto">Stylish</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body>成功加入購物車！</Toast.Body>
        </Toast>
      </div>
    </Container>

  );
}
export default Product;
