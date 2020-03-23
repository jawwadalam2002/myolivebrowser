import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { Style } from '../../style';
import { Toolbar } from '../Toolbar';
import { Line, StyledApp } from './style';
import store from '../../store';

const GlobalStyle = createGlobalStyle`${Style}`;

const App = observer(() => {
  return (
    <ThemeProvider
      theme={{ ...store.theme, animations: store.settings.object.animations }}
    >
      <div className="left-side" id="left-side">
        <div className="logo">
          <img src="assets/images/logo.png" alt="" />
        </div>
        <div className="left-scroll">
          <div className="large-image">
            <img src="assets/images/img-1.png" alt="" />
          </div>
          <div className="small-image">
            <img src="assets/images/img-2.png" alt="" />
          </div>
          <div className="small-image">
            <img src="assets/images/img-3.png" alt="" />
          </div>
          <div className="small-image">
            <img src="assets/images/img-2.png" alt="" />
          </div>
          <div className="small-image">
            <img src="assets/images/img-3.png" alt="" />
          </div>
        </div>
        <div className="mobile-tab" id="mobile-tab">

        </div>
      </div>
      <div className={"right-side"}>
        <div className="footer">
          <div className="row m-0">
            <div className="col-3">

            </div>
            <div className="col-9 latest-new">
              <h4>Latest News</h4>
            </div>
            <div className="col-3 foote-logo">
              <img src="assets/images/logo.png" alt="" />
            </div>
            <div className="col-9 new-marquee">
              <div>
                <marquee>Text here to be placed </marquee>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StyledApp>
        <GlobalStyle />
        <Toolbar />
        <Line />
      </StyledApp>
    </ThemeProvider>
  );
});

export default hot(App);
