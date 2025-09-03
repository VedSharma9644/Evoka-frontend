import React from 'react';
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  LinkedinIcon
} from 'react-share';

const ShareSidebar = () => {
  const shareUrl = window.location.href;

  return (
    <div style={{
      position: 'fixed',
      top: '40%',
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '10px',
      zIndex: 1000,
    }}>
      <FacebookShareButton url={shareUrl}>
        <FacebookIcon size={40} round />
      </FacebookShareButton>
      <WhatsappShareButton url={shareUrl}>
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>
      <TwitterShareButton url={shareUrl}>
        <TwitterIcon size={40} round />
      </TwitterShareButton>
      <LinkedinShareButton url={shareUrl}>
        <LinkedinIcon size={40} round />
      </LinkedinShareButton>
    </div>
  );
};

export default ShareSidebar;
