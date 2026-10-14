import React, { useState } from 'react';
import { MessageSquare, CalendarX, Users2 } from 'lucide-react';

export default function ComparisonSlider() {
  const [isSpotWay, setIsSpotWay] = useState(true);

  const comparisons = [
    {
      title: 'Channels, chats and missed messages',
      icon: <MessageSquare size={24} color="#59a7f0" />,
      oldVideo: 'https://www.spotvirtual.com/videos/the-old-way/Conversation.mp4',
      spotVideo: 'https://www.spotvirtual.com/videos/the-Spot-way/Left.mp4',
      badge: isSpotWay ? 'Spot Organic Chat' : 'Slack Cluttered Channels'
    },
    {
      title: 'Calendar confusion and meeting mixups',
      icon: <CalendarX size={24} color="#ff5f98" />,
      oldVideo: 'https://www.spotvirtual.com/videos/the-old-way/Notification.mp4',
      spotVideo: 'https://www.spotvirtual.com/videos/the-Spot-way/Middle.mp4',
      badge: isSpotWay ? 'Instant Walk-in Rooms' : 'Link Requests & Delays'
    },
    {
      title: 'Siloed teams and culture chasms',
      icon: <Users2 size={24} color="#60c449" />,
      oldVideo: 'https://www.spotvirtual.com/videos/the-old-way/Zoom.mp4',
      spotVideo: 'https://www.spotvirtual.com/videos/the-Spot-way/Right.mp4',
      badge: isSpotWay ? 'Shared Office Vibes' : 'Isolated Video Grid'
    }
  ];

  return (
    <section className="Section_section CompareSection_section">
      <div className="Section_container Section_narrow">
        <div className="CompareSection_contentWrapper">
          {/* Header */}
          <div className="CompareSection_headingWrapper">
            <h2 className="CompareSection_title xlargeHeading">
              Not all remote tools are created equal
            </h2>
            <div className="mediumBodyText" style={{ maxWidth: '42ch' }}>
              Slack, Zoom, and <em>*shudders*</em> Microsoft Teams... none of these were built for this new way of working. They were built to improve the old way. And it shows. So we built something specifically for the new way of working.
              <br /><br />
              <b style={{ color: '#232a30' }}>See if you can spot the difference.</b>
            </div>
          </div>

          {/* Switch Toggle */}
          <div className="CompareSection_toggleWrapper">
            <div
              className="CompareSection_buttonWrapper largeBodyText"
              onClick={() => setIsSpotWay(!isSpotWay)}
              role="button"
              aria-label="Toggle between old way and Spot way"
            >
              <div
                className="CompareSection_oldWayText"
                style={{ opacity: isSpotWay ? 0.45 : 1, transform: isSpotWay ? 'scale(0.96)' : 'scale(1.04)' }}
              >
                The old way
              </div>

              <div className={`CompareSection_toggleButton ${isSpotWay ? 'CompareSection_spotWay' : ''}`}>
                <div className="CompareSection_toggleCircle" />
              </div>

              <div
                className="CompareSection_spotWayText"
                style={{ opacity: isSpotWay ? 1 : 0.45, transform: isSpotWay ? 'scale(1.04)' : 'scale(0.96)' }}
              >
                The Spot way
              </div>
            </div>

            {/* 3 Interactive Cards with Synchronized Video Previews */}
            <div className="CompareSection_screensWrapper">
              {comparisons.map((item, index) => (
                <div key={index} className="CompareSection_screenWrapper">
                  <div className="CompareSection_screenMask">
                    {/* The Old Way Screen */}
                    <div className={`CompareSection_screen CompareSection_oldWay ${isSpotWay ? 'CompareSection_inactive' : ''}`}>
                      <video
                        src={item.oldVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                      />
                    </div>

                    {/* The Spot Way Screen */}
                    <div className={`CompareSection_screen CompareSection_spotWay ${isSpotWay ? 'CompareSection_active' : ''}`}>
                      <video
                        src={item.spotVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                      />
                    </div>
                  </div>

                  <div className="CompareSection_screenText">
                    <div style={{ flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <h3>{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
