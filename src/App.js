import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';

import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button } from 'react-bootstrap';
import {sendMail, sendSms} from './providers'

import './App.css';

const hasValidData = (values) => Object.values(values).every(item => item.trim())

function App() {
  useEffect(() => {
    // when using vh and vw units in css:
    // to make sure the height taken into account
    // is the whole window size,
    // not the visible window size
    // (critical on mobile, where, on click on the contact form inputs,
    // the keyboard appears and takes half of the window size,
    // which shrinks the form size - unpleasant user experience)
    setTimeout(() => {
      const viewheight = window.innerHeight;
      const viewwidth = window.innerWidth;
      const viewport = document.querySelector('meta[name=viewport]');
      viewport.setAttribute('content', `height=${viewheight}px, width=${viewwidth}px, initial-scale=1.0`);
    }, 300);
  }, []);

  const [values, setValues] = useState({
    personName: '',
    mail: '',
    phone: ''
  });

  const [submission, setSubmission] = useState({
    success: false,
    fail: false,
  });

  const handleChange = (event) => {
    setValues(({ ...values, [event.target.name]: event.target.value }));
  };

  const uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  };

  const visioURL = `${process.env.REACT_APP_VISIODOMAIN}/${Date.now()}${uuidv4()}`;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { personName, mail, phone } = values;

    // either mail or phone info is required
    const contactInfo = mail || phone;

    const infoToSend = {
      personName,
      contactInfo
    };

    if (!hasValidData(infoToSend)) {
      window.alert('Certains champs n\'ont pas été renseignés, veuillez procéder aux modifications');
      return;
    };
    
    let provider;

    const params = {
      personName,
      generatedLink: visioURL
    };

    try{

      if (mail || phone) {

        if (mail) {
          provider = await sendMail({
            ...params,
            mail
          })
        }
        
        if (phone) {
          provider = await sendSms({
            ...params,
            phone
          })
        }

      }
      else {
        //todo manage all
        //provider = Promise.all([])
      }
    
      setSubmission({
        ...submission,
        success: true,
        fail: false
      });
 
    } catch(e){

      setSubmission({
        ...submission,
        success: false,
        fail: true
      });

    } finally{
      // to make sure submission result is visible,
      // as well as the link where user can join their contact
      window.scrollTo({
        top: document.querySelector('.form-submission-message').offsetTop,
        behavior: 'smooth',
      });
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Instant Visio</h1>
        <Container>
          <p className="App-desc">Saisissez le numéro de téléphone mobile ou l'email de la personne que vous souhaitez rejoindre en visiophone (vous pouvez saisir les deux).</p>
          <p className="App-desc">Un message sera envoyé pour que votre proche puisse vous rejoindre directement en visiophone et échanger avec vous.</p>
        </Container>
      </header>
      <body className="App-body">
        <Container>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Votre nom</Form.Label>
              <Form.Control
                type="text"
                name="personName"
                placeholder="Ex. : Laure"
                title="Veuillez saisissez votre nom"
                value={values.personName}
                required
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicPhone">
              <Form.Label>Numéro de téléphone de votre proche (optionnel si vous renseignez une adresse e-mail)</Form.Label>
              <Form.Control
                type="phone"
                name="phone"
                placeholder="Ex. : 0706050403"
                title="Saisissez le numéro de téléphone de votre proche"
                value={values.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>E-mail de votre proche (optionnel si vous renseignez un numéro de téléphone)</Form.Label>
              <Form.Control
                type="email"
                name="mail"
                placeholder="Ex. : laure.durand@gmail.com"
                title="Saisissez l'adresse e-mail de votre proche"
                value={values.mail}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
              </Form.Text>
            </Form.Group>
            <Button style={ {float: "right"}} variant="success" type="submit">
              Joindre mon proche
            </Button>
          </Form>
        </Container>
        <div className="form-submission-message">
          {/* submission.success && <p>Le message a bien été envoyé à votre proche. Cliquez sur <a href={visioURL} target="_blank"
              rel="noopener noreferrer">sur ce lien</a> votre proche vous y rejoindra en visio.</p> */}
          {submission.success && <Route
            render={() => {
              window.location.href = visioURL;
              return null;
            }}
          />}
          {submission.fail && <p>Le message n'a pas pu être envoyé. Veuillez soumettre le formulaire à nouveau.</p>}
        </div>
      </body>
    </div>
  );
}

export default App;