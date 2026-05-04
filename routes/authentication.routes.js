import { Router } from 'express';
import { signIn_user, signOut_user } from '../functions/authentication.functions.js'

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { user_email, user_password } = req.body;

    const data = await signIn_user(user_email, user_password);

    if (!data?.session) {
      return res.status(401).json({ error: 'INVALID CREDENTIALS' });
    }

    res.cookie('access_token', data.session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 15
    });

    res.cookie('refresh_token', data.session.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return res.status(200).json({ message: 'OK' });

  } catch (err) {
    return res.status(500).json({ error: 'LOGIN FAILED' });
  }
});

router.post('/logout', async (req, res) => {

    try{
        const {error} = await signOut_user();

        return res.status(200).json({message: 'OK'});

    }catch (err) {
        return res.status(500).json({ error: 'LOGOUT FAILED' });
    }

})

export default router;