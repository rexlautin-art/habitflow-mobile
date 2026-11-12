import axios from 'axios';

const FALLBACK = '"La constancia vence al talento cuando el talento no es constante."';

export async function fetchQuote(): Promise<string> {
  try {
    const { data } = await axios.get('https://dummyjson.com/quotes/random', {
      timeout: 8000,
    });
    return `"${data.quote}" — ${data.author}`;
  } catch {
    return FALLBACK;
  }
}
