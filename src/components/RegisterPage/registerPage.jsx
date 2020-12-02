import React, { useRef, useState } from 'react';
import './registerPage.css';
import {useForm} from 'react-hook-form';
import firebase from '../../firebase';
import md5 from 'md5';
import {useHistory} from 'react-router-dom';

const RegisterPage = (props) => {
    const { register, watch, errors, handleSubmit } = useForm();
    const history = useHistory();
    const password = useRef();
    password.current = watch("password");
    
    const [errorSubmit, SetErrorSubmit] = useState('');
    const [loading, setLoading] = useState(false);
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            
            let createUser = await firebase
            .auth()
            .createUserWithEmailAndPassword(data.email, data.password);

            await createUser.user.updateProfile({
                displayName: data.name,
                photoURL: `http://gravatar.com/avatar/${md5(createUser.user.email)}?d=identicon`

            });

            await firebase.database().ref('users').child(createUser.user.uid).set({
                name: createUser.user.displayName,
                image: createUser.user.photoURL
            })
            
            history.push("/login");
            console.log(createUser);
            return () => setLoading(false);
        } catch(error) {
            setLoading(false);
            SetErrorSubmit(error.message);
            setTimeout(() => {
                SetErrorSubmit('')
            },5000)
        }
    }

    return (
        <section className="signupPage">
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Sign up</h1>
      <label>Email</label>
      <input
        name="email"
        type="email"
       ref={register({ required: true, pattern: /^\S+@\S+$/i })}
      />
      {errors.email && <p>email is required</p>}
      <label>Name</label>
      <input
        name="name"
       ref={register({ required: true, maxLength: 10 })}
      />
       {errors.name && errors.name.type === 'required' && <p>name is required.</p>}
       {errors.name && errors.name.type === 'maxLength' && <p>name exceeded max length.</p>}
      <label>Password</label>
      <input
      
        name="password"
        type="password"
       ref={register({ required: true, minLength: 6 })}
      />
      {errors.password && errors.password.type === 'required' && <p>password is required.</p>}
      {errors.password && errors.password.type === 'minLength' && <p>password must have at least 6 characters.</p>}
       {errors.passowrd && "email is required"}
      <label>Password Confirm</label>
      <input
        
        name="pssword_confirm"
        type="password"
       ref={register({ required: true,
        validate: (value) => value === password.current
    })}
      />
       {errors.pssword_confirm && errors.pssword_confirm.type === 'required' && <p>password confirm is required.</p>}
      {errors.pssword_confirm && errors.pssword_confirm.type === 'validate' && <p>password doesn't match.</p>}
     {errorSubmit && <p>{errorSubmit}</p>}
      <input type="submit" disabled={loading}/>
    </form>
    </section>
    )
};

export default RegisterPage;