// Use relative path for Vite proxy in development, or full URL for production
const API_URL = import.meta.env.DEV ? "/api" : "http://localhost/elibrary_api";

export async function getBooks() {
  try {
    const response = await fetch(`${API_URL}/get_books.php`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

export async function addBook(book: any) {
  const response = await fetch(`${API_URL}/add_book.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return response.json();
}

export async function updateBook(book: any) {
  const response = await fetch(`${API_URL}/update_book.php`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return response.json();
}

export async function deleteBook(id: number) {
  const response = await fetch(`${API_URL}/delete_book.php`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return response.json();
}
