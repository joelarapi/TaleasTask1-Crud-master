import  { useEffect, useState } from 'react';
import axios from 'axios';

const GettingBooks = () => {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/books')
      .then((response) => {
        console.log('API Response:', response.data);
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the book data!", error);
        setError("Failed to fetch books. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <>
       <h2>Here is a list of all my books:</h2>
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <ul className="galleryRow">
          {books.map((book) => (
            <ul key={book._id}>
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Published: {book.publish_date}</p>
            </ul>
          ))}
        </ul>
      )}
 
     <h2>Here is a list of all my books comments:</h2>
      {books.length === 0 ? (
        <p>No comments available</p>
      ) : (
        <ul className="galleryRow">
          {books.map((book) => (
            <ul key={book._id}>
              <h3>{book.title}</h3>
              <p>CommentsID: {book.comments}</p>
            </ul>
          ))}
        </ul>
      )}
    </>
  )
}

export default GettingBooks