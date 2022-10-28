import React, { useEffect, useState } from "react";
import axios from "axios";
function Admin() {
  const [users, setUsers] = useState([]);

  function axion() {
    axios.get("/users").then((res) => {
      setUsers(res.data.filter((e) => e.isAdmin !== true));
    });
  }

  let handleDelete = async (e) => {
    await axios.delete(`/users/${e}`);
    axion();
  };

  let handleBan = async (e) => {
    await axios.put(`/users/${e}`, { ban: true });
    axion();
  };

  let handleDesBan = (e) => {
    axios.put(`/users/${e}`, { ban: false });
    axion();
  };

  useEffect(() => {
    axion();
  }, []);
  return (
    <div className="h-screen">
      <section className="w-[400px] bg-gray-300 h-auto sm:h-screen text-center">
        <h1 className="p-4 text-2xl">Tabla de usuarios</h1>
        {users &&
          users.map((e, i) => (
            <div key={i} className="border-2 flex gap-10 justify-center items-center rounded">
              <p className="text-xl font-medium">{e.name}{" "}</p> 
              <button className="border-2 bg-red-400 p-1 justify-center rounded" onClick={() => handleDelete(e.email)}>Eliminar</button>{" "}
              {e.isBanned && (
                <button className="border-2 bg-green-400 rounded p-1 justify-center" onClick={() => handleDesBan(e.email)}>Desbanear</button>
              )}
              {!e.isBanned && (
                <button className="border-2 rounded bg-red-400 p-1 justify-center" onClick={() => handleBan(e.email)}>Banear</button>
              )}
            </div>
          ))}
      </section>
    </div>
  );
}

export default Admin;
