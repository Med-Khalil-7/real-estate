import React from 'react';
/* eslint react/prop-types: 0 */

const Nav = ({totalSteps, currentStep, goToStep}) => {
  const dots = [];
  for (let i = 1; i <= totalSteps; i += 1) {
    const isActive = currentStep === i;
    dots.push((
      <span
        key={`step-${i}`}
        className={`dot ${isActive ? "active" : ''}`}
        onClick={() => goToStep(i)}
      >&bull;</span>
    ));
  }

  return (
    <div className="wiznav">{dots}</div>
  );
};

export default Nav;
