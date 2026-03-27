export const fx9Menu = [
  {
    category: "User",
    icon: "👤",
    items: [
      { name: "Base Setting", type: "submenu" },
      { name: "Shooting Mode", type: "select", options: ["Custom", "Cine EI"] },
      { name: "Format Media", type: "action" },
      { name: "Assignable Button", type: "submenu" }
    ]
  },
  {
    category: "Shooting",
    icon: "🎥",
    items: [
      { name: "ISO/Gain/EI", type: "submenu", children: [
          { name: "ISO/Gain", type: "select", options: ["L 800", "H 4000"] },
          { name: "Exposure Index", type: "select", options: ["1000EI", "800EI", "640EI", "500EI", "400EI"] }
      ]},
      { name: "ND Filter", type: "submenu", children: [
          { name: "Preset/Variable", type: "select", options: ["Preset", "Variable"] },
          { name: "Auto ND Filter", type: "select", options: ["Off", "On"] },
          { name: "ND Preset", type: "select", options: ["Clear", "1/4", "1/16", "1/64"] }
      ]},
      { name: "Shutter", type: "submenu", children: [
          { name: "Mode", type: "select", options: ["Angle", "Speed", "ECS", "Off"] },
          { name: "Shutter Angle", type: "select", options: ["180.0", "172.8", "144.0", "90.0", "45.0"] }
      ]},
      { name: "Auto Focus", type: "submenu", children: [
          { name: "AF Transition Speed", type: "slider", min: 1, max: 7, value: 5 },
          { name: "AF Subj Shift Sens", type: "slider", min: 1, max: 5, value: 3 },
          { name: "Face/Eye Detection AF", type: "select", options: ["Face/Eye Only", "Face/Eye Priority", "Off"] }
      ]},
      { name: "White", type: "submenu", children: [
          { name: "Preset White", type: "select", options: ["3200K", "4300K", "5600K"] },
          { name: "Color Temp", type: "number", value: 5600 }
      ]}
    ]
  },
  {
    category: "Project",
    icon: "🎬",
    items: [
      { name: "Base Setting", type: "submenu", children: [
          { name: "Target Display", type: "select", options: ["SDR(BT.709)", "HDR(HLG)"] },
          { name: "Shooting Mode", type: "select", options: ["Custom", "Cine EI"] }
      ]},
      { name: "Rec Format", type: "submenu", children: [
          { name: "Video Format", type: "select", options: ["4096x2160", "3840x2160", "1920x1080"] },
          { name: "Frame Rate", type: "select", options: ["23.98p", "24p", "25p", "29.97p", "50p", "59.94p"] },
          { name: "Codec", type: "select", options: ["XAVC-I", "XAVC-L"] }
      ]},
      { name: "Imager Scan Mode", type: "submenu", children: [
          { name: "Imager Scan", type: "select", options: ["FF 6K", "FF crop 5K", "S35 4K", "S16 2K"] }
      ]}
    ]
  },
  {
    category: "Paint",
    icon: "🎨",
    items: [
      { name: "Black", type: "submenu" },
      { name: "Gamma", type: "select", options: ["S-Cinetone", "Standard", "Still", "ITU709"] },
      { name: "Matrix", type: "submenu" },
      { name: "Knee", type: "submenu" },
      { name: "Detail", type: "submenu" }
    ]
  },
  {
    category: "TC/Media",
    icon: "⏱️",
    items: [
      { name: "Timecode", type: "submenu", children: [
          { name: "Mode", type: "select", options: ["Preset", "Regen"] },
          { name: "Run", type: "select", options: ["Rec Run", "Free Run"] }
      ]},
      { name: "Format Media", type: "submenu", children: [
          { name: "Media A", type: "action" },
          { name: "Media B", type: "action" }
      ]}
    ]
  },
  {
    category: "Monitoring",
    icon: "🖥️",
    items: [
      { name: "Output On/Off", type: "submenu" },
      { name: "Display On/Off", type: "submenu", children: [
          { name: "Lens Info", type: "select", options: ["On", "Off"] },
          { name: "Focus Info", type: "select", options: ["On", "Off"] },
          { name: "Video Info", type: "select", options: ["On", "Off"] }
      ]},
      { name: "Marker", type: "submenu", children: [
          { name: "Center Marker", type: "select", options: ["On", "Off"] },
          { name: "Aspect Marker", type: "select", options: ["Line", "Mask", "Off"] }
      ]},
      { name: "Peaking", type: "submenu" },
      { name: "Zebra", type: "submenu" }
    ]
  },
  {
    category: "Audio",
    icon: "🎤",
    items: [
      { name: "Audio Input", type: "submenu", children: [
          { name: "CH1 Level", type: "slider", min: 0, max: 99, value: 50 },
          { name: "CH2 Level", type: "slider", min: 0, max: 99, value: 50 }
      ]},
      { name: "Audio Format", type: "select", options: ["LPCM 24-bit 48kHz"] }
    ]
  },
  {
    category: "Thumbnail",
    icon: "🖼️",
    items: [
      { name: "Play", type: "action" },
      { name: "Delete", type: "action" }
    ]
  },
  {
    category: "Technical",
    icon: "⚙️",
    items: [
      { name: "Color Bars", type: "submenu" },
      { name: "Tally", type: "select", options: ["Front", "Rear", "Both", "Off"] },
      { name: "Fan Control", type: "select", options: ["Auto", "Minimum", "Off"] },
      { name: "Language", type: "select", options: ["English", "Japanese", "French", "Spanish"] },
      { name: "Clock Set", type: "datetime" }
    ]
  },
  {
    category: "Network",
    icon: "🌐",
    items: [
      { name: "Access", type: "select", options: ["Wi-Fi", "LAN"] },
      { name: "Wi-Fi Setting", type: "submenu" },
      { name: "Network Reset", type: "action" }
    ]
  }
];
