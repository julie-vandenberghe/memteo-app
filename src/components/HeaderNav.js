import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { FaCheck } from "react-icons/fa";
import Logo from "../assets/logoMemteo.png"
import "../stylesheet/HeaderNav.scss"

export const HeaderNav = ({ onWeatherInput }) => {
  const [city, setCity] = useState('');

  const handleInputChange = (e) => {
    setCity(e.target.value);
    console.log(setCity);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onWeatherInput(city); // Appel de la fonction de gestion de la ville dans l'app component
    setCity(''); // Effacer l'input après la soumission
  };

  return (
    <div className="navbar">
      <img src={Logo} alt="Logo Memetéo" className="logo"/>
      <Form layout="inline" onSubmit={handleFormSubmit}>
        <Form.Item>
          <Input placeholder="Tapez votre recherche ici..." value={city} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">
          <FaCheck color='#51ADCE'/>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default HeaderNav;
