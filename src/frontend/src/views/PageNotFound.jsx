import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';

function PageNotFound() {
  const CenterContainer = styled(Container)`
  text-align: center ;
`;
  return (
    <CenterContainer className="mt-5">
      <h1>⚠️404 Error</h1>
      <h2>Page Not Found</h2>
    </CenterContainer>
  );
}
export default PageNotFound;
