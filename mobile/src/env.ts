const prod = {
  url: 'https://example.com'
};

const dev = {
  url: 'http://192.168.0.6:8000'
};

export const env = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? dev : prod;
