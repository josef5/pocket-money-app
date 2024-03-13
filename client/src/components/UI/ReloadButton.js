import React, { useRef, useImperativeHandle, forwardRef } from 'react';

const ReloadButton = forwardRef(({ onClick }, ref) => {
  const iconPath = useRef(null);

  const animate = () => {
    iconPath.current?.classList.remove('animate');

    window.requestAnimationFrame(() =>
      iconPath.current?.classList.add('animate')
    );
  };

  useImperativeHandle(ref, () => ({
    animate,
  }));

  return (
    <button
      type="button"
      className="reload-button"
      aria-label="Left Align"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="20px"
        height="20px"
      >
        <path
          ref={iconPath}
          d="M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50s50-22.4,50-50S77.6,0,50,0z M20,54.6C20,54.6,20,54.6,20,54.6c-2.2,0-4-1.8-4-4
        c0.1-9,3.6-17.3,10-23.6c11.5-11.5,29.3-13,42.4-4.5l4.7-4.7c0.5-0.5,1.3-0.5,1.8,0c0,0,0,0,0,0c0.2,0.2,0.3,0.5,0.4,0.8l1.4,15.3
        c0.1,0.7-0.4,1.3-1.1,1.4c0,0,0,0,0,0h-0.2L60,33.8c-0.7-0.1-1.2-0.7-1.1-1.4c0,0,0,0,0,0c0-0.3,0.1-0.5,0.3-0.7l3.4-3.4
        c-9.9-5.5-22.6-4-31,4.3c-4.9,4.8-7.6,11.2-7.6,18C24,52.8,22.2,54.6,20,54.6z M74.1,75C67.4,81.6,58.7,85,50,85
        c-6.4,0-12.9-1.8-18.4-5.4l-4.7,4.7c-0.5,0.5-1.3,0.5-1.8,0c0,0,0,0,0,0c-0.2-0.2-0.3-0.5-0.4-0.8l-1.4-15.3
        c-0.1-0.7,0.4-1.3,1.1-1.4c0,0,0,0,0,0h0.2L40,68.2c0.7,0.1,1.2,0.7,1.1,1.4c0,0,0,0,0,0c0,0.3-0.1,0.5-0.3,0.7l-3.4,3.4
        C41.2,75.8,45.5,77,50,77c0,0,0,0,0,0c6.9,0,13.5-2.7,18.4-7.6c4.8-4.8,7.5-11.2,7.6-18c0-2.2,1.8-4,4.1-3.9c2.2,0,4,1.8,3.9,4.1
        C83.9,60.4,80.3,68.7,74.1,75z"
          fillOpacity="0.75"
          fill="#fff"
        />
      </svg>
    </button>
  );
});

export default ReloadButton;
