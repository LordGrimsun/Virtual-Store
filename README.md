# Spot Virtual — Full Website Clone

A pixel-perfect, interactive 1:1 clone of **[Spot Virtual](https://www.spotvirtual.com/)** built from scratch with React 18, Vite, and modular CSS.

---

## ✨ Features & Pages

- **Interactive 2D Virtual Office Sandbox**: Click to move your avatar across rooms (Lobby, Engineering Lab, Focus Pods, Coffee Lounge), chat with the OpenClaw AI Bot, and trigger reaction emotes.
- **Synchronized Video Comparison Slider**: Real-time slider comparing *"The Old Way"* (exhausting video grid) vs. *"The Spot Way"* (ambient spatial movement).
- **Interactive Feature Tabs**: 5 dedicated tabs with CDN video playback (Collaboration, Meetings, Rooms, Floorplans, Culture).
- **Multi-Page Hash Router**:
  - **Home (`#home`)**: Full hero video, social proof, comparison slider, feature tabs, G2 high-performer proof, statistics, and interactive sandbox.
  - **Pricing (`#pricing`)**: Monthly vs. Annual billing toggle (20% off), Basic / Growth / Enterprise cards, 8-row feature comparison matrix, Contrast CTO testimonial, and FAQ accordion.
  - **AI Agents (`#ai-agents`)**: Dark mode (`#111827`), OpenClaw bot badge with live presence pulse, 3 core value propositions, natural interaction & multi-agent war room showcases, enterprise governance controls, and open protocol compatibility.
  - **Virtual Offices (`#virtual-offices`)**: Spatial workspace overview, spontaneous connection pillars, infinite multi-screen sharing, personal desks, and sound-isolated conference pods.
  - **Virtual Events (`#virtual-events`)**: Event venue showcase, 6 event capabilities (auditoriums, networking lounges, sponsor booths, breakouts, megaphone), 3-step workflow, and organizer testimonial.
  - **Downloads (`#downloads`)**: Desktop client cards for macOS (Universal DMG), Windows 10/11 (.exe), Linux (.AppImage), and zero-install Web client.
- **Authentication & Demo Modal**: Full modal supporting Sign In, Free Trial signup, and Demo scheduling.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans & Space Grotesk
- **Styling**: Modular CSS (`spot-base.css`, `spot-components.css`, `spot-home.css`, `spot-pricing.css`, `spot-agents.css`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/LordGrimsun/Virtual-Store.git

# Navigate into project directory
cd Virtual-Store

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```
