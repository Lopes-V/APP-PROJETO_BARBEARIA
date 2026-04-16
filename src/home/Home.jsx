import api from './services/api';
import { useEffect } from 'react';
export function Home() {
    
    async function login(password,username) {
        response = await api.get()
    }
  return (
    <main>
      <div>
        <h1>LOGIN</h1>
        <div>
            <form action="" method="post">
                <input type="text" name="username-login" id="username-login" placeholder="Username"/>
                <input type="password" name="password-login" id="password-login"/>
                <button type="submit" id="btn-send-login">login</button>
            </form>
        </div>
      </div>
    </main>
  );
}
