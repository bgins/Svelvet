import { createClient, SupabaseClient, type AuthChangeEvent, type PostgrestResponse, type Session, type User, type UserIdentity } from '@supabase/supabase-js';
import { userInfoStore  } from './authStoreTs';
import { get } from 'svelte/store';
let { user, logged_in, user_avatar, user_name, user_email, diagrams } = userInfoStore;

// this is the root of all of our supabase functionalities. We will export these into the __layout.svelte file, which is a top layer component that sits on top of our whole page (it will be easier to keep user state this way)

// import supabase db url and anon key in order to connect to the database
const supabase_URL: string = import.meta.env.VITE_SVELTE_APP_SUPABASE_URL;

const supabase_ANON_KEY: string = import.meta.env.VITE_SVELTE_APP_SUPABASE_ANON_KEY;
// console.log(import.meta.env.VITE_SVELTE_APP_SUPABASE_ANON_KEY, import.meta.env.VITE_SVELTE_APP_SUPABASE_URL)


// this is how we initialize the supabase connection
export const supabase: SupabaseClient = createClient(supabase_URL, supabase_ANON_KEY);

// supabase native method used to sign out of account
export const logout: Function = async function signout(): Promise<void>{
  const { error: Error } = await supabase.auth.signOut()
};

// supabase native method used to sign in using GitHub OAuth
export const signInWithGithub: Function = async function signInWithGithub(): Promise<void> {
  try{

  const { user: User, session: Session, error: Error } = await supabase.auth.signIn(
    {provider: 'github'}, {redirectTo: window.location.href}
  )
  }
  catch(error) {
    console.log("Error with signing in: ", error);
  }
}

// supabase native method that returns user info
export const userInfo: User | null = supabase.auth.user();

// supabase native method that detects when the Auth state changes
export default supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null): void => {
  const loggedInUser: User | null = supabase.auth.user();
  const identitiesArray: UserIdentity[] | undefined = loggedInUser?.identities;
  if(event === 'SIGNED_IN' && session !== null && session !== undefined && identitiesArray !== undefined) {
    const avatar: string = identitiesArray[0].identity_data.avatar_url;
    user_avatar.set(avatar);
    user.set(session.user);
    const username: string = identitiesArray[0].identity_data.user_name;
    const email: string = identitiesArray[0].identity_data.email;
    user_name.set(username);
    user_email.set(email);
    logged_in.set(true);
    if(session.user) {
      // populate diagrams store with the user's diagram objects from the db
      getCodeFromDB(email)
      .then((data: void | any[]) => {
        if(data) {
          diagrams.set(data);
        }
      })
      .catch((error: Error) => {
        return console.error(error);
      })
    }
  }
  if(event === 'SIGNED_OUT') {
    user.set(null);
    logged_in.set(false);
    user_name.set('');
    user_email.set('');
    diagrams.set([]);
  }
});

//TODO type project_store
export const addCodeToDB: Function = async (code: string, test_email: string, diagramName: string, project_store: any[]): Promise<void> => {
  let updatedDiagramStore: any[] = [];
  //const {data, error} =
  await supabase
    .from('user_saved_projects')
    .insert([
      { code: code, created_by: test_email, diagram_name: diagramName }
    ])
    .then((response: PostgrestResponse<any>) => {
      if(response.error !== null) {
        console.log(response.error);
        return;
      }
      if(response.body) {
        updatedDiagramStore = [...project_store, response.body[0]];
        diagrams.set(updatedDiagramStore);
      }
    })
}


//Creating a new thread to DB from create-post.svelte

export const addThreadToDB: Function = async (inputSubjectString: string, inputBodyString: string): Promise<void> => {
  // let updatedDiagramStore: any[] = [];
  //const {data, error} =
  console.log('logging inputSubjectString: ', inputSubjectString);
  const inserts = [
    { post_subject: inputSubjectString, post_body: inputBodyString, created_at: new Date }
  ];
  console.log('inserts', inserts);
  const response: any = await supabase
    .from('discussion_posts')
    .insert(inserts);
    // .from('user_saved_projects')
    // .insert([
    //   { code: 'chris test', created_by: 'chris test', diagram_name: 'chris test' }
    // ])
    // remove by T$
    // .then((response: PostgrestResponse<any>) => {
    // });
  console.log('AFTER RESPONSE!!!!!: ')
  if(response.error !== null) {
    console.log(response.error);
    return;
  }
  if(response.body) {
    console.log('successfully stored in DB!');
    // diagrams.set(updatedDiagramStore);
  }
}

export const getCodeFromDB: Function = async (user_email: string): Promise<void | any[]> => {
  const {data, error} = await supabase
  .from('user_saved_projects')
  .select('*')
  .in('created_by', [user_email])
  if(error) {
    console.error("Message: ", error.message, "Details: ", error.details);
    return;
  }
  return data;
};



// Copy and Pasted from getCodeFromDB and edited to become getPostFRromDB to test DB functionality
export const getPostFromDB: Function = async (): Promise<void | any[]> => {
  console.log('in the getPostFromDB function!!!');
  const {data, error} = await supabase
  .from('discussion_posts')
  .select(`id, created_at, post_subject, post_body`)
  console.log('retrieved data: ', data)
  if(error) {
    console.error("Message: ", error.message, "Details: ", error.details);
    return;
  }
  return data;
};

// End of getPostFromDB test








export const current_session: Session | null = supabase.auth.session();

//TODO type project_store
export const updateCodeInDB: Function = async (id: number, updated_code: string, project_store: any[]): Promise<void> => {
  const {data, error} = await supabase
    .from('user_saved_projects')
    .update({ code: updated_code })
    .match({ id: id })

    const updatedDiagramStore: any[] = [];
    // TODO: refactor so that we are not passing project_store around and are accessing diagrams array with the get and update method instead
    // const diagramsArray = get(diagrams);
    //TODO circle back to strongly type the obj parameter
    project_store.forEach((obj) => {
      if(data && obj.id === data[0].id) {
        updatedDiagramStore.push({...obj, code: data[0].code});
      }
      else {
        updatedDiagramStore.push(obj);
      }
    })
    diagrams.set(updatedDiagramStore);
    if(error) {
        console.error("Message: ", error.message, "Details: ", error.details);
        return;
    }
}

export const deleteCodeFromDB: Function = async (id: number, project_store: any[]): Promise<void> => {
  const {data, error} = await supabase
    .from('user_saved_projects')
    .delete()
    .match({ id: id })
    const updatedDiagramStore: any[] = [];
    project_store.forEach(obj => {
      if(data && obj.id !== data[0].id) {
        updatedDiagramStore.push(obj);
      }
    })
    diagrams.set(updatedDiagramStore);
    if(error) {
      return console.error(error);
    }
}
