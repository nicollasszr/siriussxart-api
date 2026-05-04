import { supabase } from '../index.js'

export async function signUp_user(user_email, user_password){

    try{

        const { data, error } = await supabase.auth.signUp(
            {
                email : user_email,
                password : user_password
            }
        )

        if (error){
            throw error.message
        }

        if (data.user && !data.session){
            return {message : "Verify you email to proceed"}
        }
    
        return data;

    }
    catch(error){
        throw 'UNKNOW ERROR: ' + error.message
    }

};

export async function signIn_user(user_email, user_password){

    try{

        const { data, error } = await supabase.auth.signInWithPassword(
            {
                email : user_email,
                password : user_password
            }
        )
    
        if (!data || error){
            throw error?.message || 'FAILED TO LOGIN'
        }
    
        return data;

    }
    catch(error){
        throw 'UNKNOW ERROR: ' + error.message
    }

};

export async function signOut_user(){

    try{

        const { error } = await supabase.auth.signOut(
            {scope : 'local'}
        );

        if (error){
            throw error.message
        }

    }
    catch(error){
        throw 'UNKNOW ERROR: ' + error.message
    }

};

export const authorize = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'INVALID TOKEN' });
  }

  req.user = user;
  
  next();
};

export const authorizeAdmin = (req, res, next) => {
  
    const user = req.user;

  if (user.app_metadata?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado: Requer privilégios de Admin' });
  }

  next();
};