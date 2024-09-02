import  { useEffect, useState } from 'react';
import axios from 'axios';

const GettingUsers = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then((response) => {
        console.log('API Response:', response.data);
        setUsers(response.data);
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
       <h2>Here is a list of all my users:</h2>
      {users.length === 0 ? (
        <p>No users available</p>
      ) : (
        <ul className="galleryRow">
          {users.map((user) => (
            <ul key={user._id}>
              <h3>{user.userName}</h3>
              <p>Email: {user.email}</p>
              <p>CommentsId: {user.userComments}</p>
            </ul>
          ))}
        </ul>
      )}


      <h2>Here is a list of all my user comments:</h2>
      {users.length === 0 ? (
        <p>No comments available</p>
      ) : (
        <ul className="galleryRow">
          {users.map((user) => (
            <ul key={user._id}>
              <h3>{user.userName}</h3>
              <p>CommentsID: {user.userComments}</p>
            </ul>
          ))}
        </ul>
      )}
    </>
  )
}

export default GettingUsers