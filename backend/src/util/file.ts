import { promises as fs } from 'fs';
import path from 'path';

export async function getHtmlTemplate(template: string) {
  const file = path.join(global.rootPath, 'view', template + '.html');
  return await fs.readFile(file, { encoding: 'utf-8' });
}
