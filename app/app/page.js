// page.js (Home Page)

"use client";

import { useState } from 'react';

export default function HomePage() {
  //set name to what is entered into the name field
  const [name, setName] = useState('');
  
  //set email to what is entered into the email field
  const [email, setEmail] = useState('');

  //Set password to what is entered into the password field
  const [password, setPassword] = useState('');

  //Set keywords to what is entered into the keywords field
  const [keywords, setKeywords] = useState('');

  const handleSubmit = async (e) => {

    //Prevent default POST req
    e.preventDefault();

    //Create const variable of the data
    const data = {name, email, password, keywords};

    //Fetch the data from API/register route, make a POST request of JSON data that is equal to the data from the states.
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });

    if(response.ok){
      console.log(data);
    } else{
      console.log('POST FAILED');
    }
  };

  return (
    <div>
      <h1>User Registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Keywords (comma-separated):</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

