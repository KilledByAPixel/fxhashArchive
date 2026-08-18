$fx.params([
  {
    id: "scarf",
    name: "scarf design",
    type: "number",
    default: 1,
    options: {
      min: 1,
      max: 5,
      step: 1,
    },
  },
  {
    id: "voice1",
    name: "spell",
    type: "bytes",
    update: "code-driven", 
    options: {
      length: 30,
    },
  },
  {
    id: "voice2",
    name: "bound",
    type: "bytes",
    update: "code-driven", 
    options: {
      length: 30,
    },
  },
  {
    id: "voice3",
    name: "🙊",
    type: "bytes",
    update: "code-driven", 
    options: {
      length: 30*1024,
    },
  },
  {
    id: "recorded",
    name: "🙉",
    type: "boolean",
    update: "code-driven", 
    default: false,
  },
]);