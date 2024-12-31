// pages/users.js

import React from 'react';

// This function will run on the server to fetch the users from JSONPlaceholder API
export async function getServerSideProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await res.json();

  return {
    props: {
      users,
    },
  };
}

const ServerSideUsersPage = ({ users }) => {
  return (
    <div>
      <h1>User List</h1>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServerSideUsersPage;


// pages/users.js

// import React, { useEffect, useState } from 'react';

// const ClientSideUsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch users on component mount
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch('https://jsonplaceholder.typicode.com/users');
//         const data = await res.json();
//         setUsers(data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>User List</h1>
//       <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Username</th>
//             <th>Email</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.id}</td>
//               <td>{user.name}</td>
//               <td>{user.username}</td>
//               <td>{user.email}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ClientSideUsersPage;
