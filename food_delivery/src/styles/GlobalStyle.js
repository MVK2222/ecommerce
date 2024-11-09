import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }
`;

export default GlobalStyle;
