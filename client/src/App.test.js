import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});


/*

#CardContainer {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 40vh;
    height: 80vh;
    border: double 5px #97881b;
    padding: 1vh;
    display: inline-block;
    text-align: center;
    margin: 1vh;
    border-radius: 2vh;
    position: relative;

//     .card_image {
//     margin-bottom: -6vh;
// }

.card_action {
    position: absolute;
    bottom: 20vh;
    border-style: inset;
    background-color: #e7e5e4d6;
}

#cardPlayButton {
    position: absolute;
    bottom: 5vh;
    left: 0;
    right: 0
  }

  .card_value {
    font-weight: 600;
    font-size: 25px;
    text-shadow: 1px 1px 1px #97881b;
    text-align: center;
    width: 10vh;
    height: 10vh;
    border: 1px solid #021a40;
    border-radius: 50px;
    display: inline-block;
    line-height: 2;
    background-color: #c8bdbda3;
    margin: 0 auto;
    float: left;
  }

  .card_name {
    border-bottom: 1px solid #97881b;
    text-shadow: 1px 1px 1px #97881b;
    display: inline-block;
    text-align: center;
    border-top: 1px solid #97881b;
    float: right;
    font-size: 25px;
    margin-top: 1vh;
    background-color: #f5f5f59c;
    font-weight: 600;
  }

.action_text{font-weight: 600;
margin-top: 2vh;
font-size: 15px;
}




*/
