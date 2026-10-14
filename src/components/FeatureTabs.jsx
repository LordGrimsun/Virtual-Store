import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Be more productive',
      blocks: [
        {
          type: 'small',
          title: 'Less scheduled meetings, more quick sync-ups',
          desc: 'Need to catch-up with a co-worker? Just walk over to their desk and start talking, just like you used to.',
          video: 'https://www.spotvirtual.com/videos/be-more-productive/HiFive.mp4'
        },
        {
          type: 'small',
          title: 'Navigate yourself to instant meeting and calls',
          desc: 'No more “can somebody send me the link?” Just head to a meeting room, take a seat and start making things happen.',
          video: 'https://www.spotvirtual.com/videos/be-more-productive/Navigate.mp4'
        },
        {
          type: 'large',
          title: "See what's happening at a glance",
          desc: "Want to know who's around and who's working on what? Just take a peek around the office and you'll be up to speed.",
          bullets: [
            'Never miss a meeting',
            "Know who to approach and who's on DND",
            'Boost spontaneous interactions'
          ],
          video: 'https://www.spotvirtual.com/videos/be-more-productive/Spotataglance.mp4'
        }
      ]
    },
    {
      name: 'Collaborate remotely',
      blocks: [
        {
          type: 'small',
          title: 'Get conversation flowing with workplace polls',
          desc: "Want to encourage casual conversation? Take a straw poll on company opinion? Spot's quick poll tool makes it easy.",
          video: 'https://www.spotvirtual.com/videos/collaborate-remotely/Voting.mp4'
        },
        {
          type: 'small',
          title: 'Work collaboratively with simultaneous screensharing',
          desc: "Share your screen, upload PDFs or work from a shared web browser... all ways that we're making screensharing better.",
          video: 'https://www.spotvirtual.com/videos/collaborate-remotely/Screenshare.mp4'
        },
        {
          type: 'large',
          title: 'Set up shared spaces designed for collaboration',
          desc: 'Set up spaces designed to spark conversation, innovation and team spirit and get your team working (and feeling) better.',
          bullets: [
            'Whiteboards and enhanced screensharing',
            'High-fives and emotes for celebrating ideas',
            'Brings back that in-person feel and collaboration'
          ],
          video: 'https://www.spotvirtual.com/videos/collaborate-remotely/WhiteboardSession.mp4'
        }
      ]
    },
    {
      name: 'Bring back those good vibes',
      blocks: [
        {
          type: 'small',
          title: 'Jam out together as a team',
          desc: 'Stream your favorite playlists directly from your computer to the office and let everyone listen in and feel the vibes.',
          video: 'https://www.spotvirtual.com/videos/bring-back-good-vibes/MusicPlayer.mp4'
        },
        {
          type: 'small',
          title: 'Get everybody gathered around the latest funny cat video',
          desc: 'Shared jokes and memes are a core part of modern company culture, so we made it even easier to gather around YouTube, virtually.',
          video: 'https://www.spotvirtual.com/videos/bring-back-good-vibes/CatScene.mp4'
        },
        {
          type: 'large',
          title: 'Celebrate like you used to',
          desc: 'Put on silly hats, grab a slice of pizza and kick back in zones designed to encourage casual conversation, fun and team-building.',
          bullets: [
            'Birthday? Bring out the cake and celebrate',
            'Big win? Hit the gong and release the confetti',
            'Holidays? Decorate the office and make it snow!'
          ],
          video: 'https://www.spotvirtual.com/videos/bring-back-good-vibes/BirthdayCelebration.mp4'
        }
      ]
    },
    {
      name: 'Have better meetings',
      blocks: [
        {
          type: 'small',
          title: 'No more missed meetings or broken links',
          desc: "No more “can somebody send me the link?” Just head to the meeting room and you'll be in the meeting, just like it used to be.",
          video: 'https://www.spotvirtual.com/videos/have-better-meetings/WalkingtoMeeting.mp4'
        },
        {
          type: 'small',
          title: 'Work smarter with better screensharing',
          desc: "Share your screen, upload PDFs or work from a shared web browser. All ways that we're making screensharing better.",
          video: 'https://www.spotvirtual.com/videos/have-better-meetings/ZoomMeeting.mp4'
        },
        {
          type: 'large',
          title: 'Choose a meeting mode that works for you',
          desc: 'Whether you want the traditional video call tiles, a virtual meeting or something a little more private, Spot has you covered.',
          bullets: [
            'Use Presenter Mode to control speakers',
            'Go classic with traditional video call functionality',
            'Lock your rooms for extra privacy and security'
          ],
          video: 'https://www.spotvirtual.com/videos/have-better-meetings/ZoomMeeting.mp4'
        }
      ]
    },
    {
      name: 'Stay private and secure',
      blocks: [
        {
          type: 'small',
          title: 'Lock your meetings for extra security and privacy',
          desc: 'Need to talk about something privately? Holding HR meetings or performance reviews? Lock the room to keep everything private.',
          video: 'https://www.spotvirtual.com/videos/stay-private-and-secure/Lock.mp4'
        },
        {
          type: 'small',
          title: 'Everything you do is secure and private',
          desc: 'Voice and video communications are secured using TLS encryption and are not stored on our servers.',
          video: 'https://www.spotvirtual.com/videos/stay-private-and-secure/FloatingLock.mp4'
        },
        {
          type: 'large',
          title: 'Stay safe with enterprise-level roles and permissions',
          desc: 'Grant access to spaces, rooms and channels through our robust role-based permission system, supporting teams of any size.',
          bullets: [
            'Fine-tune user access controls',
            'Create private spaces and rooms',
            'Single sign-on (SSO)'
          ],
          video: 'https://www.spotvirtual.com/videos/stay-private-and-secure/AdminControls.mp4'
        }
      ]
    }
  ];

  const currentTab = tabs[activeTab];

  return (
    <section className="Section_section FeaturesSection_section">
      <div className="Section_container Section_narrow">
        <div className="FeaturesSection_contentWrapper">
          {/* Header */}
          <div className="FeaturesSection_headingWrapper">
            <div className="FeaturesSection_teamWrapper mediumBodyText">
              <span>Your team are more than green dots.</span>
              <img
                src="https://www.spotvirtual.com/_next/static/media/online-avatar.c4ae6154.svg"
                alt="Online avatar"
                className="FeaturesSection_onlineAvatar"
              />
            </div>
            <h2 className="FeaturesSection_title xlargeHeading">
              Welcome to<br /> in-person, online.
            </h2>
            <p className="FeaturesSection_paragraph">
              All the features of Slack and Zoom plus the things you used to do in the office: walk up to your colleagues' desks, high-five, gather around the watercooler, celebrate big wins, decorate your office...
            </p>
          </div>

          {/* Tab Selector Bar */}
          <div className="FeaturesSection_featureTabs">
            <div className="FeaturesSection_tabsWrapper">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`FeaturesSection_tab ${activeTab === idx ? 'FeaturesSection_activeTab' : ''}`}
                >
                  <h3>{tab.name}</h3>
                </button>
              ))}
            </div>

            {/* Tab Content Display */}
            <div className="FeaturesSection_tabContent" key={activeTab}>
              {/* Block 1 (Small) */}
              <div className="FeaturesSection_tabContentBlock FeaturesSection_smallBlock">
                <div>
                  <div className="FeaturesSection_blockTitle largeBodyText">
                    {currentTab.blocks[0].title}
                  </div>
                  <div className="FeaturesSection_blockDescription">
                    {currentTab.blocks[0].desc}
                  </div>
                </div>
                <div className="FeaturesSection_videoWrapper">
                  <video
                    src={currentTab.blocks[0].video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                </div>
              </div>

              {/* Block 2 (Small) */}
              <div className="FeaturesSection_tabContentBlock FeaturesSection_smallBlock">
                <div>
                  <div className="FeaturesSection_blockTitle largeBodyText">
                    {currentTab.blocks[1].title}
                  </div>
                  <div className="FeaturesSection_blockDescription">
                    {currentTab.blocks[1].desc}
                  </div>
                </div>
                <div className="FeaturesSection_videoWrapper">
                  <video
                    src={currentTab.blocks[1].video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                </div>
              </div>

              {/* Block 3 (Large) */}
              <div className="FeaturesSection_tabContentBlock FeaturesSection_largeBlock">
                <div className="FeaturesSection_left">
                  <div className="FeaturesSection_blockTitle largeBodyText">
                    {currentTab.blocks[2].title}
                  </div>
                  <div className="FeaturesSection_blockDescription">
                    {currentTab.blocks[2].desc}
                  </div>
                  <div className="FeaturesSection_bulletsWrapper">
                    {currentTab.blocks[2].bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="Bullet_bulletWrapper">
                        <svg width="20" height="20" viewBox="0 0 18 18" fill="none" className="Bullet_bullet">
                          <circle cx="9" cy="9" r="9" fill="#4EBEF4" />
                          <path d="M5.5 9.23077L6.32515 10.4619C7.1278 11.6594 8.89539 11.6402 9.67174 10.4254L12.5 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="FeaturesSection_right">
                  <video
                    src={currentTab.blocks[2].video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
