import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');

  async function handleSignUp() {
    if (!signUpEmail || !signUpPassword || !signUpName) {
      return alert('Preencha todos os campos!');
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        data: { name: signUpName }
      }
    });
    setLoading(false);
    if (error) return alert(error.message);
    alert('Cadastro realizado! Verifique seu e-mail para confirmar.');
    setShowSignUp(false);
    setSignUpEmail('');
    setSignUpPassword('');
    setSignUpName('');
  }

  async function handleSignIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return alert(error.message);
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  }

  return (
    <div className="login">
      {!showSignUp ? (
        <>
          <h2>Bem-vindo(a)!</h2>
          <p>Entre com seus dados para continuar</p>
          <form>
            <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn} disabled={loading}>Entrar</button>
          {/* <button onClick={handleGoogleLogin}>Entrar com Google</button> */}

          <p>Ainda não tem conta? <button className="btn-cadastre-se" onClick={() => setShowSignUp(true)} disabled={loading}>Cadastre-se</button></p>
          </form>
        </>
      ) : (
        <div className="signup-modal">
          <h2>Faça seu cadastro</h2>
          <form>
            <input
            type="text"
            placeholder="Nome"
            value={signUpName}
            onChange={(e) => setSignUpName(e.target.value)}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
          />
          <button onClick={handleSignUp} disabled={loading}>Cadastrar</button>
          <button className='btn-voltar' onClick={() => setShowSignUp(false)}>Voltar</button>
          </form>
        </div>
      )}
    </div>
  );
}
