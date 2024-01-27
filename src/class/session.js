// const { use } = require("../route")

class Session {
  static #list = []

  constructor(user) {
    this.token = Session.generateCode()
    this.user = {
		email:user.email,
		isConfirm:user.isConfirm,
		role: user.role,
		id:user.id,

	}
  }

  static generateCode = () => {
	const lenght=6
	const characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
	let result=''
	for (let i=0; i<lenght; i++){
		const randomIndex=Math.floor(Math.random()*characters.length)
		result +=characters[randomIndex]
	}
	return result
  }
    
  

  static create = (user) => {
 const session=new Session (user)
 this.#list.push(session)
 return session
  }

  
  static get=(token)=>{
	return (this.#list.find((item)=>item.token===token) //.find повертає перешне зайдене по умові
	|| null)
  }
}

module.exports = {
  Session,
}

console.log (Session.generateCode())
