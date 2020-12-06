import React, {  useState } from 'react';
import './loginPage.css';
import {useForm} from 'react-hook-form';
import firebase from '../../firebase';
import {Link} from 'react-router-dom';


const LoginPage = (props) => {
    
   

    const { register, errors, handleSubmit } = useForm();
    const [errorSubmit, setErrorSubmit] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        
        try {
                
            setLoading(true);
            await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
            setLoading(false);
            
        } catch(error) {
            
            setLoading(false);
            setErrorSubmit(error.message);
            
            setTimeout(() => {
                setErrorSubmit('')
            },5000)
        }
    }

    return (
        <section className="signupPage">
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Sign in</h1>
      <label>Email</label>
      <input
        name="email"
        type="email"
       ref={register({ required: true, pattern: /^\S+@\S+$/i })}
      />
      {errors.email && <p>email is required</p>}
      
      <label>Password</label>
      <input
      
        name="password"
        type="password"
       ref={register({ required: true, minLength: 6 })}
      />
      {errors.password && errors.password.type === 'required' && <p>password is required.</p>}
      {errors.password && errors.password.type === 'minLength' && <p>password must have at least 6 characters.</p>}
       
       {errorSubmit&& <p>{errorSubmit}</p>}
       <Link to="/register">회원가입</Link>
      
      <input type="submit" disabled={loading}/>
    </form>
    </section>
    
    )
};

export default LoginPage;