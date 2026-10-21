/**
 * Where the monorepo keeps its files.
 *
 * There are three applications in this repository — the public website, the
 * admin panel and the employee workspace — and they all read and write the same
 * data. If each one resolved the shared data folder against its own working
 * directory, the employee portal would see no leads and the admin panel would
 * see a different set from the website, and the bug would only appear once the
 * three were deployed to three different places.
 *
 * So the root is found once, by walking up until the folder that declares the
 * workspaces is reached, and every path in the repository hangs off it.
 *
 * The leads that ship with the site are not in a folder at all — they are
 * inside the shared package, so they travel with the code to every deploy.
 */

import fs from 'node:fs';
import path from 'node:path';

let cached: string | null = null;

/**
 * The repository root.
 *
 * Walked up from wherever the process was started, looking for the
 * `package.json` that lists the workspaces. If there is no such file — a copy
 * of one app on its own, say — the working directory is used and everything
 * behaves exactly as it did before the three apps were joined up.
 */
export function repoRoot(): string {
  if (cached) return cached;

  let dir = process.cwd();

  for (let depth = 0; depth < 8; depth += 1) {
    const manifest = path.join(dir, 'package.json');
    try {
      const raw = fs.readFileSync(manifest, 'utf8');
      if (JSON.parse(raw)?.workspaces) {
        cached = dir;
        return dir;
      }
    } catch {
      // No manifest here, or it is not JSON. Keep walking.
    }

    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  cached = process.cwd();
  return cached;
}

/**
 * The folder the file backend writes to.
 *
 * Shared by all three apps, so an employee created on the panel is the same
 * employee on the portal even with no database configured.
 */
export function dataDir(): string {
  return path.join(repoRoot(), '.data');
}

/** A writable file in the shared data folder. */
export function dataFile(name: string): string {
  return path.join(dataDir(), name);
}
