export function fmtSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function extOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "";
}

const FILE_ICONS: Record<string, string> = {
  pdf: "📄",
  png: "🖼️", jpg: "🖼️", jpeg: "🖼️", gif: "🖼️", webp: "🖼️", svg: "🖼️", avif: "🖼️",
  mp4: "🎬", webm: "🎬", mov: "🎬", mkv: "🎬", avi: "🎬",
  mp3: "🎵", wav: "🎵", ogg: "🎵", flac: "🎵", m4a: "🎵",
  zip: "🗜️", rar: "🗜️", "7z": "🗜️", tar: "🗜️", gz: "🗜️",
  txt: "📝", md: "📝",
  csv: "📊", json: "📋", xml: "📋",
  doc: "📄", docx: "📄",
  xls: "📊", xlsx: "📊",
  ppt: "📊", pptx: "📊",
  js: "💻", ts: "💻", py: "💻", html: "💻", css: "💻",
};

export function iconFor(name: string): string {
  return FILE_ICONS[extOf(name)] || "📦";
}

export function nameFromPathname(pathname: string): string {
  return pathname.split("/").pop() || pathname;
}
