export interface GalleryQuery { project?: number; room?: string }

/**
 * `#/gallery?project=2969` or `#/gallery?room=tz1…`. Anything unrecognised is
 * simply absent: a stale link lands in the lobby, never on an error.
 */
export function parseGalleryQuery(search: string): GalleryQuery {
  const params = new URLSearchParams(search)
  const out: GalleryQuery = {}
  const project = params.get('project')
  if (project && /^\d+$/.test(project)) out.project = Number(project)
  const room = params.get('room')
  if (room) out.room = room
  return out
}
