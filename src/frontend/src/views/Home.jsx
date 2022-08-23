import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Container, Row, Col, Image,
} from 'react-bootstrap';
import SpinnerSVG from '../images/Spinner.svg';
import '../styles/style.css';

const Img = styled(Image)`
max-width: ${(prop) => (prop.src === 'src/images/Spinner.svg' ? '200px' : '320px')};
height: ${(prop) => (prop.src === 'src/images/Spinner.svg' ? '200px' : '480px')};
`;
const ImgBox = styled.div`
display: flex;
width: 320px;
height: 480px;
align-items: center;
justify-content: center;
`;
const ColorBox = styled.div`
width: 24px;
height: 24px;
display: inline-flex;
background-color: ${(prop) => (prop.color ? prop.color : 'transparent')};
border: 2px  solid;
border-color: ${(prop) => (prop.color === '#ffffff' ? '#111111' : 'transparent')};
margin-right: 10px;
margin-top: 20px;
margin-bottom: 20px;

`;
const P = styled.p`
font-family: 'Noto Sans TC', '蘋方-繁', NotoSansCJKtc;
font-size: 20px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: normal;
letter-spacing: 4px;
text-align: left;
color: #3f3a3a;
margin-bottom: 10px;
`;

const ProductLink = styled(LinkContainer)`
cursor: pointer;
`;
const NextPageButton = styled(Button)`
display: ${(prop) => (prop.next_paging ? '' : 'none')};
`;
const PrePageButton = styled(Button)`
display: ${(prop) => (prop.now_paging === 0 ? 'none' : '')};
`;

function Home() {
  const { catalog } = useParams();
  const [data, setData] = useState({ product: [], spec: [] });
  const [nowPage, setNowPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const getData = (page) => {
    axios
      .get(`/api/1.0/products/${(catalog || 'women')}?paging=${page}`)
      .then((response) => {
        // console.log(response.data);
        setData(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err.response.data);
      });
  };
  useEffect(() => {
    setIsLoading(true);
    getData(0);
    setNowPage(0);
  }, [catalog]);

  const list = data.product.map((obj) => (
    <Col className="mb-5" key={`${obj.id}`}>
      <Container className="d-flex justify-content-center flex-column align-items-center">
        <ProductLink to={`/product/${obj.id}`}>
          <div>
            <ImgBox>
              <Img src={isLoading ? SpinnerSVG : obj.photoURL} />
            </ImgBox>
            <div>
              {Array.from(new Set(obj.color)).map((color) => (
                <ColorBox key={`${obj.id}${color}`} color={color} />
              ))}
            </div>
            <P>{obj.name}</P>
            <P>{`TWD.${obj.prices}`}</P>
          </div>
        </ProductLink>
      </Container>
    </Col>
  ));
  return (
    <div>
      <Container className="px-0 mt-5">
        <Row className="align-items-center d-flex justify-content-between">
          {list}
        </Row>
        <Row className="mb-5">
          <Col me="auto">
            <PrePageButton
              now_paging={nowPage}
              variant="secondary"
              onClick={() => {
                getData(nowPage - 1);
                setNowPage(nowPage - 1);
              }}
            >
              ◀
            </PrePageButton>
          </Col>
          <Col className="d-flex justify-content-end">
            <NextPageButton
              variant="secondary"
              className="me-5"
              next_paging={data.next_paging}
              onClick={() => {
                getData(data.next_paging);
                setNowPage(nowPage + 1);
              }}
            >
              ▶
            </NextPageButton>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default Home;
