// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')


User.create({
  email: 'test@mail.com',
  password: 123,
  role: 1,
})
User.create({
	email: 'test1@mail.com',
	password: 123,
	role: 2,
  })
  User.create({
	email: 'test3@mail.com',
	password: 123,
	role: 3,
  })
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назву компонентів
    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    // вказуємо назву сторінки
    title: 'Signup page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'Користувач' },
        {
          value: User.USER_ROLE.ADMIN,
          text: 'Адміністратор',
        },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Розробник',
        },
      ],
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/signup', function (req, res) {
  const { email, password, role } = req.body
  console.log(req.body)

  if (!email || !password || !role) {
    return res.status(400).json({
      message: `Помилка. Обов'язкові поля відсутні.`,
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: `Користувач ${user} вже існує.`,
      })
    }
    const newUser = User.create({ email, password, role })
    const session = Session.create(newUser)
    Confirm.create(newUser.email)

    return res.status(200).json({
      message: `Користувача успішно зареєстровано.`,
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: `Помилка створення користувача.`,
    })
  }
})

router.get('/recovery', function (req, res) {
  res.render('recovery', {
    name: 'recovery',
    component: ['back-button', 'field'],
    title: 'Recovery page',
    data: {},
  })
})

router.post('/recovery', function (req, res) {
  const { email } = req.body
  console.log(email)

  if (!email) {
    return res.status(400).json({
      message: `Помилка. Обов'язкові поля відсутні.`,
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Користувача з таким email не існує.',
      })
    }
    //==================

    Confirm.create(email)
    return res.status(200).json({
      message: 'Код для відновлення паролю відправлено.',
    })

    //==================
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

router.get('/recovery-confirm', function (req, res) {
   res.render('recovery-confirm', {
    name: 'recovery-confirm',
    component: ['back-button', 'field', 'field-password'],
    title: 'Recovery confirm page',
    data: {},
  })
})

router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log(password, code)

  if (!code || !password) {
    return res.status(400).json({
      message: `Помилка. Обов'якові поля відсутні.`,
    })
  }

  try {
    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: `Код не існує.`,
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: `Користувач з таким email не існує.`,
      })
    }
    user.password = password
    console.log(user)

    const session = Session.create(user)

    return res.status(200).json({
      message: `Пароль змінено.`,
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку
const {renew, email}=req.query

if (renew){
	Confirm.create(email)
}

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup-confirm', {
    // вказуємо назву контейнера
    name: 'signup-confirm',
    // вказуємо назву компонентів
    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    // вказуємо назву сторінки
    title: 'Signup-confirm page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body
  if (!code || !token) {
    return res.status(400).json({
      message: `Помилка. Обов'язкові поля відустні`,
    })
  }
  try {
    const session = Session.get(token)
    if (!session) {
      return res.status(400).json({
        message: `Помилка. Ви не ввійшли в аккаунт.`,
      })
    }
    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: `Код не існує.`,
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: `Код не дійсний.`,
      })
    }

    session.user.isConfirm = true

    const user = User.getByEmail(session.user.email)

    user.isConfirm = true

    return res.status(200).json({
      message: `Ви підтвердили свою пошту.`,
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/login', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('login', {
    // вказуємо назву контейнера
    name: 'login',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password'],

    // вказуємо назву сторінки
    title: 'Login page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/login', function (req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: `Помилка. Обов'язкові поля відустні`,
    })
  }

  try {
    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message: `Помилка. Користавувача з таким email не існує.`,
      })
    }
    if (user.password !== password) {
      return res.status(400).json({
        message: `Помилка. Неправильний пароль, перевірте.`,
      })
    }
    const session = Session.create(user)
    return res.status(200).json({
      message: `Ви увійшли.`,
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})
// Підключаємо роутер до бек-енду
module.exports = router
