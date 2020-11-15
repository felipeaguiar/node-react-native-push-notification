import { promises as fs } from 'fs';
import path from 'path';

export function setPageable(query, params) {
  const page = parseInt(params.page) || 0;
  const size = parseInt(params.size) || 10;

  query = query.limit(size).offset(page * size);

  return query;
}

export async function getHtmlTemplate(template: string) {
  const file = path.join(__dirname, template + '.html');
  return await fs.readFile(file, { encoding: 'utf-8' });
}
