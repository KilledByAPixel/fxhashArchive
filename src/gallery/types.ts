// The shape of public/data/gallery.json, written by scripts/build-gallery.mjs.
// Metres, y up. A `yaw` names the direction (sin yaw, 0, cos yaw): a painting's or
// sign's normal into its room, or a pose's facing.

export interface Pose { x: number; z: number; yaw: number }
export interface FloorRect { x: number; z: number; w: number; d: number }

export interface Room {
  id: string                         // a corridor part, an era id, an artist tz address, or 'lobby'
  /** 'hall' is a stretch of corridor; 'era' is a zero-area marker where an era begins, listed in the Rooms menu. */
  kind: 'lobby' | 'hall' | 'solo' | 'era'
  title: string
  rect: FloorRect
  /** Just inside the door, facing in — where the Rooms menu lands you. */
  entry: Pose
}

/** A solid wall segment. Lintels over doors have y0 > 0 and block nobody. */
export interface Wall { x1: number; z1: number; x2: number; z2: number; y0: number; y1: number }

export interface Painting {
  project: number
  slug: string
  name: string
  artist: string
  year: number
  room: string
  x: number
  z: number
  yaw: number
  /** Index into the atlas sequence; see tileUv in geometry.ts. */
  tile: number
  /** Size on the wall in metres: the preview's proportions, PAINTING on the long side. */
  w: number
  h: number
  /**
   * The query fxhash ran this project's preview with — `?fxhash=…` and, for
   * fx(params) work, a `#0x…` fragment — so the piece can open on the very
   * iteration the thumbnail shows. Absent for the first metadata format, which
   * never recorded it.
   */
  preview?: string
}

export interface Sign {
  text: string
  /** `panel` is the lobby's prose — set in the body weight, where a name is set bold. */
  kind: 'title' | 'era' | 'room' | 'plaque' | 'panel'
  x: number; y: number; z: number; yaw: number
  w: number; h: number
}

export interface AtlasMeta {
  size: number; tile: number; gutter: number; cols: number
  files: string[]    // relative to data/
  small: string[]    // same layout at half scale, for phones
}

/** A block of the lobby's wall text: a heading and the lines under it. */
export interface AboutPanel {
  heading: string
  lines: string[]
}

export interface Gallery {
  generatedAt: string
  counts: { paintings: number; artists: number; soloRooms: number; years: [number, number] }
  atlas: AtlasMeta
  spawn: Pose
  /** What the lobby walls say, so the HUD can say it too. Absent on data built before it existed. */
  about?: AboutPanel[]
  rooms: Room[]
  walls: Wall[]
  paintings: Painting[]
  signs: Sign[]
}
