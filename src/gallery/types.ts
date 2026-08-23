// The shape of public/data/gallery.json, written by scripts/build-gallery.mjs.
// Metres, y up. A `yaw` names the direction (sin yaw, 0, cos yaw): a painting's or
// sign's normal into its room, or a pose's facing.

export interface Pose { x: number; z: number; yaw: number }
export interface FloorRect { x: number; z: number; w: number; d: number }

export interface Room {
  id: string                         // era id, artist tz address, or 'lobby'
  kind: 'lobby' | 'hall' | 'solo'
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
}

export interface Sign {
  text: string
  kind: 'title' | 'era' | 'room' | 'plaque'
  x: number; y: number; z: number; yaw: number
  w: number; h: number
}

export interface AtlasMeta {
  size: number; tile: number; gutter: number; cols: number
  files: string[]    // relative to data/
  small: string[]    // same layout at half scale, for phones
}

export interface Gallery {
  generatedAt: string
  counts: { paintings: number; artists: number; soloRooms: number; years: [number, number] }
  atlas: AtlasMeta
  spawn: Pose
  rooms: Room[]
  walls: Wall[]
  paintings: Painting[]
  signs: Sign[]
}
