export function like(field): string {
  return '%' + String(field).toUpperCase() + '%';
}

export function upper(field): string {
  return String(field).toUpperCase();
}

export function getOder(order): 'ASC' | 'DESC' {
  return String(order).toLowerCase() === 'DESC' ? 'DESC' : 'DESC';
}

export function setPageable(query, params) {
  const page = parseInt(params.page) || 0;
  const size = parseInt(params.size) || 10;

  query = query.limit(size).offset(page * size);

  return query;
}
