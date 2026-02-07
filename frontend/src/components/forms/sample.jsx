import React, { useEffect, useState } from "react";
import axios from "axios";

function DisplayName() {
  const [names, setNames] = useState([]); // array instead of string

  useEffect(() => {
    axios.get("https://or-management-system.onrender.com/registration")
      .then((res) => {
        console.log(res.data); // check if array
        setNames(res.data.map(user => user.name)); // store array of names
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>User Names</h2>
      <ul>
        {names.map((n, i) => <li key={i}>{n}</li>)}
      </ul>
    </div>
  );
}

export default DisplayName;
