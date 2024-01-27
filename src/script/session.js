export const SESSION_KEY = 'sessionAuth'

export const saveSession = (session) => {
  try {
    window.session = session
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session),
    )
  } catch (err) {
    console.log(err)
    window.session = null
  }
}

export const loadSession = () => {
  // const json=localStorage.getItem(SESSION_KEY)
  // if (json) {
  // const session=JSON.parse( json)}

  try {
    const session = JSON.parse(
      localStorage.getItem(SESSION_KEY),
    )

    if (session) {
      window.session = session
    } else {
      window.session = null
    }
  } catch (err) {
    console.log(err)
    window.session = null
  }
}

export const getTokenSession=()=>{
	try {
const session= getSession()
return session ? session.token : null
	  } catch (err) {
		console.log(err)
		return null
	  }
}

export const getSession=()=>{
	try {
		const session = JSON.parse(
		  localStorage.getItem(SESSION_KEY)) || window.session;
	return session||null

	  } catch (err) {
		console.log(err)
		return null
	  }
}