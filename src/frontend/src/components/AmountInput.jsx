import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import '../styles/style.css';

const AmountInputfield = styled.input.attrs({ type: 'number' })`
   ::-webkit-outer-spin-button,
   ::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }
  width:130px;
  text-align: center;
  border: 1px solid #3f3a3a;
  border-right: 0;
  border-left: 0;

`;
const AmountInputButton = styled(Button)`
  background-color: transparent;
  color:#3f3a3a;
  border: 1px solid #3f3a3a;
  border-radius: 0;
`;
const AmountInputButtonAdd = styled(AmountInputButton)`
  border-left:0;
`;
const AmountInputButtonSubtract = styled(AmountInputButton)`
  border-right:0;
`;
function AmountInput(props) {
  const { maxNum, setCounts, counts } = props;
  const handinputChange = (event) => {
    const val = parseInt(event.target.value, 10) >= maxNum
      ? maxNum : parseInt(event.target.value, 10);
    setCounts(val || 0);
  };

  useEffect(() => {
    setCounts(maxNum < counts ? maxNum : counts);
  }, [maxNum]);

  return (
    <div className="ms-4 d-flex">
      <AmountInputButtonSubtract onClick={() => {
        setCounts(counts > 1 ? (counts - 1) : counts);
      }}
      >
        -
      </AmountInputButtonSubtract>
      <AmountInputfield value={counts} onChange={handinputChange} name="productAmount" type="number" />
      <AmountInputButtonAdd onClick={() => {
        setCounts(counts >= maxNum ? counts : counts + 1);
      }}
      >
        +
      </AmountInputButtonAdd>
    </div>
  );
}
export default AmountInput;
