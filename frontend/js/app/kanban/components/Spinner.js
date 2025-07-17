import React from 'react';
import { Fade, CircularProgress } from '@material-ui/core';
import { css } from '@emotion/core';

const Spinner = ({ loading }) => (
  <Fade
    in={loading}
    style={{
      transitionDelay: loading ? '800ms' : '0ms',
    }}
    unmountOnExit
    css={css`
      padding: 0.5rem;
    `}
  >
    <CircularProgress />
  </Fade>
);

export default Spinner;
