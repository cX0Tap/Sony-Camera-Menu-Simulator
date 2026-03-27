export const fx3Menu = [
  {
    category: "Shooting",
    icon: "📷",
    color: "#ff5252",
    subCategories: [
      {
        title: "1. Image Quality",
        items: [
          { name: "File Format", type: "select", options: ["XAVC S-I 4K", "XAVC HS 4K", "XAVC S 4K", "XAVC S HD"] },
          { name: "Movie Settings", type: "submenu", children: [
            { name: "Rec Frame Rate", type: "select", options: ["24p", "25p", "30p", "50p", "60p", "100p", "120p"] },
            { name: "Record Setting", type: "select", options: ["240M 4:2:2 10bit", "140M 4:2:2 10bit", "100M 4:2:0 8bit", "60M 4:2:0 8bit"] }
          ]},
          { name: "S&Q Settings", type: "submenu", children: [
            { name: "Rec Frame Rate", type: "select", options: ["24p", "25p", "30p", "50p", "60p"] },
            { name: "Frame Rate", type: "select", options: ["120fps", "100fps", "60fps", "50fps", "30fps", "25fps", "24fps", "15fps", "8fps", "4fps", "2fps", "1fps"] },
            { name: "Record Setting", type: "select", options: ["10-bit 4:2:2", "8-bit 4:2:0"] }
          ]},
          { name: "Proxy Settings", type: "submenu", children: [
            { name: "Proxy Recording", type: "select", options: ["On", "Off"] },
            { name: "Proxy File Format", type: "select", options: ["XAVC HS HD", "XAVC S HD"] },
            { name: "Proxy Rec. Setting", type: "select", options: ["16M 4:2:0 10bit", "9M 4:2:0 10bit"] }
          ]},
          { name: "Lens Compensation", type: "submenu", children: [
            { name: "Shading Comp.", type: "select", options: ["Auto", "Off"] },
            { name: "Chromatic Aberration Comp.", type: "select", options: ["Auto", "Off"] },
            { name: "Distortion Comp.", type: "select", options: ["Auto", "Off"] },
            { name: "Breathing Comp.", type: "select", options: ["On", "Off"] }
          ]}
        ]
      },
      {
        title: "2. Media",
        items: [
          { name: "Format", type: "select", options: ["Slot 1", "Slot 2"] },
          { name: "Rec. Media Settings", type: "submenu", children: [
            { name: "Prioritize Rec. Media", type: "select", options: ["Slot 1", "Slot 2"] },
            { name: "Recording Mode", type: "select", options: ["Standard", "Simult. (Movie)", "Sort (Movie/Still)"] },
            { name: "Auto Switch Media", type: "select", options: ["On", "Off"] }
          ]},
          { name: "Recover Image DB", type: "select", options: ["Slot 1", "Slot 2"] },
          { name: "Display Media Info.", type: "select", options: ["Slot 1", "Slot 2"] }
        ]
      },
      {
        title: "3. File",
        items: [
          { name: "File Settings", type: "submenu", children: [
            { name: "File Name Format", type: "select", options: ["Standard", "Title", "Date + Title", "Title + Date"] },
            { name: "Title Name Settings", type: "action" }
          ]}
        ]
      },
      {
        title: "4. Shooting Mode",
        items: [
          { name: "Exposure Ctrl Type", type: "select", options: ["P/A/S/M Mode", "Flexible Exp. Mode"] }
        ]
      },
      {
        title: "5. Audio Recording",
        items: [
          { name: "Audio Recording", type: "select", options: ["On", "Off"] },
          { name: "Audio Rec Level", type: "slider", min: 0, max: 31, value: 20 },
          { name: "Audio Out Timing", type: "select", options: ["Live", "Lip Sync"] },
          { name: "Wind Noise Reduct.", type: "select", options: ["Auto", "On", "Off"] },
          { name: "Audio Level Display", type: "select", options: ["On", "Off"] }
        ]
      },
      {
        title: "6. TC/UB",
        items: [
          { name: "Time Code Preset", type: "action" },
          { name: "User Bit Preset", type: "action" },
          { name: "Time Code Format", type: "select", options: ["DF", "NDF"] },
          { name: "Time Code Run", type: "select", options: ["Rec Run", "Free Run"] },
          { name: "Time Code Make", type: "select", options: ["Preset", "Regenerate"] }
        ]
      },
      {
        title: "7. Marker Display",
        items: [
          { name: "Marker Display", type: "select", options: ["On", "Off"] },
          { name: "Center Marker", type: "select", options: ["On", "Off"] },
          { name: "Aspect Marker", type: "select", options: ["Off", "4:3", "13:9", "14:9", "15:9", "1.66:1", "1.85:1", "2.35:1"] },
          { name: "Safety Zone", type: "select", options: ["Off", "80%", "90%"] },
          { name: "Guideframe", type: "select", options: ["On", "Off"] }
        ]
      }
    ]
  },
  {
    category: "Exposure/Color",
    icon: "☀️",
    color: "#ffca28",
    subCategories: [
      {
        title: "1. Exposure",
        items: [
          { name: "ISO", type: "select", options: ["Auto", "160", "200", "400", "800", "1600", "3200", "6400", "12800", "25600", "51200", "102400", "409600"] },
          { name: "Base ISO", type: "select", options: ["ISO 800", "ISO 12800"] },
          { name: "ISO Range Limit", type: "submenu", children: [
            { name: "Minimum", type: "select", options: ["ISO 160", "ISO 400", "ISO 800"] },
            { name: "Maximum", type: "select", options: ["ISO 12800", "ISO 25600", "ISO 51200", "ISO 102400", "ISO 409600"] }
          ]},
          { name: "Exposure Comp.", type: "slider", min: -5, max: 5, value: 0 }
        ]
      },
      {
        title: "2. Color/Tone",
        items: [
          { name: "White Balance", type: "select", options: ["Auto", "Daylight", "Shade", "Cloudy", "Incandescent", "Fluor.: Warm White", "Fluor.: Cool White", "Fluor.: Day White", "Fluor.: Daylight", "Flash", "Underwater Auto", "Color Temp./Filter", "Custom 1", "Custom 2", "Custom 3"] },
          { name: "Priority Set in AWB", type: "select", options: ["Standard", "Ambience", "White"] },
          { name: "Shutter AWB Lock", type: "select", options: ["Off", "Shutter Half Press", "Cont. Shooting"] },
          { name: "Picture Profile", type: "select", options: ["Off", "PP1", "PP2", "PP3", "PP4", "PP5", "PP6", "PP7", "PP8(S-Log3)", "PP9", "PP10", "PP11(S-Cinetone)"] },
          { name: "Log Shooting", type: "select", options: ["Off", "Flexible ISO", "Cine EI", "Cine EI Quick"] }
        ]
      },
      {
        title: "3. Zebra Display",
        items: [
          { name: "Zebra Display", type: "select", options: ["Off", "On"] },
          { name: "Zebra Level", type: "select", options: ["70", "75", "80", "85", "90", "95", "100", "100+", "Custom 1", "Custom 2"] }
        ]
      }
    ]
  },
  {
    category: "Focus",
    icon: "🎯",
    color: "#b388ff",
    subCategories: [
      {
        title: "1. AF/MF",
        items: [
          { name: "Focus Mode", type: "select", options: ["Continuous AF (AF-C)", "Single-shot AF (AF-S)", "Manual Focus (MF)"] },
          { name: "Set Focus Area", type: "select", options: ["Wide", "Zone", "Center Fix", "Spot: L", "Spot: M", "Spot: S", "Tracking"] },
          { name: "Focus Area Limit", type: "action" },
          { name: "AF Transition Speed", type: "slider", min: 1, max: 7, value: 5 },
          { name: "AF Subj. Shift Sensitivity", type: "slider", min: 1, max: 5, value: 5 }
        ]
      },
      {
        title: "2. Face/Eye AF",
        items: [
          { name: "Face/Eye Priority in AF", type: "select", options: ["On", "Off"] },
          { name: "Subject Detection", type: "select", options: ["Human", "Animal", "Bird", "Animal/Bird"] },
          { name: "Right/Left Eye Select", type: "select", options: ["Auto", "Right Eye", "Left Eye"] },
          { name: "Face/Eye Frame Display", type: "select", options: ["On", "Off"] }
        ]
      },
      {
        title: "3. Focus Assistant",
        items: [
          { name: "Auto Magnifier in MF", type: "select", options: ["On", "Off"] },
          { name: "Focus Magnifier Time", type: "select", options: ["2 Sec", "5 Sec", "No Limit"] },
          { name: "Initial Focus Mag.", type: "select", options: ["x1.0", "x4.0"] },
          { name: "AF in Focus Mag.", type: "select", options: ["On", "Off"] }
        ]
      },
      {
        title: "4. Peaking Display",
        items: [
          { name: "Peaking Display", type: "select", options: ["On", "Off"] },
          { name: "Peaking Level", type: "select", options: ["High", "Mid", "Low"] },
          { name: "Peaking Color", type: "select", options: ["Red", "Yellow", "Blue", "White"] }
        ]
      }
    ]
  },
  {
    category: "Playback",
    icon: "▶️",
    color: "#4fc3f7",
    subCategories: [
      {
        title: "1. Playback Target",
        items: [
          { name: "Select Playback Media", type: "select", options: ["Slot 1", "Slot 2"] },
          { name: "View Mode", type: "select", options: ["Movie", "Still Image"] }
        ]
      },
      {
        title: "2. Delete",
        items: [
          { name: "Delete", type: "action" },
          { name: "Delete All", type: "action" }
        ]
      },
      {
        title: "3. Edit",
        items: [
          { name: "Protect", type: "action" },
          { name: "Rating", type: "action" },
          { name: "Rating Set(Custom Key)", type: "action" },
          { name: "Rotate", type: "action" }
        ]
      },
      {
        title: "4. Viewing",
        items: [
          { name: "Display as Group", type: "select", options: ["On", "Off"] },
          { name: "Display Rotation", type: "select", options: ["Auto", "Manual", "Off"] }
        ]
      }
    ]
  },
  {
    category: "Network",
    icon: "🌐",
    color: "#81c784",
    subCategories: [
      {
        title: "1. Smartphone Connect",
        items: [
          { name: "Smartphone Connection", type: "select", options: ["On", "Off"] },
          { name: "Connection Info.", type: "action" },
          { name: "Select on Cam & Send", type: "action" },
          { name: "Reset Transfer Status", type: "action" }
        ]
      },
      {
        title: "2. Transfer/Remote",
        items: [
          { name: "PC Remote Function", type: "submenu", children: [
            { name: "PC Remote", type: "select", options: ["On", "Off"] },
            { name: "PC Remote Cnct Method", type: "select", options: ["USB", "Wi-Fi Direct", "Wi-Fi Access Point"] }
          ]},
          { name: "FTP Transfer Func.", type: "submenu", children: [
            { name: "FTP Function", type: "select", options: ["On", "Off"] },
            { name: "Server Setting", type: "action" }
          ]}
        ]
      },
      {
        title: "3. Wi-Fi",
        items: [
          { name: "WPS Push", type: "action" },
          { name: "Access Point Set.", type: "action" },
          { name: "Wi-Fi Frequency Band", type: "select", options: ["2.4GHz", "5GHz"] },
          { name: "SSID/PW Reset", type: "action" }
        ]
      },
      {
        title: "4. Bluetooth",
        items: [
          { name: "Bluetooth Function", type: "select", options: ["On", "Off"] },
          { name: "Pairing", type: "action" },
          { name: "Manage Paired Device", type: "action" }
        ]
      }
    ]
  },
  {
    category: "Setup",
    icon: "🛠️",
    color: "#e0e0e0",
    subCategories: [
      {
        title: "1. Area/Date",
        items: [
          { name: "Language", type: "select", options: ["English", "Français", "Español", "Português", "Deutsch", "Italiano", "日本語", "한국어", "中文"] },
          { name: "Area/Date/Time Setting", type: "action" },
          { name: "NTSC/PAL Selector", type: "action" }
        ]
      },
      {
        title: "2. Dial Customize",
        items: [
          { name: "Custom Key Setting", type: "submenu", children: [
            { name: "Custom Key(Shoot.)", type: "action" },
            { name: "Custom Key(PB)", type: "action" }
          ]},
          { name: "Fn Menu Settings", type: "action" },
          { name: "Different Set for Still/Mv", type: "action" },
          { name: "Dial Setup", type: "action" }
        ]
      },
      {
        title: "3. Touch Operation",
        items: [
          { name: "Touch Operation", type: "select", options: ["On", "Off"] },
          { name: "Touch Panel/Pad", type: "select", options: ["Touch Panel+Pad", "Touch Panel Only", "Touch Pad Only"] },
          { name: "Touch Func. in Shooting", type: "select", options: ["Touch Focus", "Touch Tracking", "Off"] }
        ]
      },
      {
        title: "4. Power Setting",
        items: [
          { name: "Auto Monitor OFF", type: "select", options: ["Does Not Turn Off", "2 Sec", "5 Sec", "10 Sec"] },
          { name: "Power Save Start Time", type: "select", options: ["30 Min", "5 Min", "2 Min", "1 Min", "10 Sec"] },
          { name: "Auto Power OFF Temp.", type: "select", options: ["Standard", "High"] }
        ]
      },
      {
        title: "5. Sound Option",
        items: [
          { name: "Audio signals", type: "select", options: ["On", "Off"] }
        ]
      },
      {
        title: "6. Reset/Save Settings",
        items: [
          { name: "Setting Reset", type: "action" },
          { name: "Save/Load Settings", type: "action" }
        ]
      }
    ]
  }
];
