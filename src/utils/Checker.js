const EamilChecker = (email = "taufik.cit.bd@gmail.com") => {
    const EmailRegex = /^[a-z0-9]+([._-][0-9a-z]+)*@[a-z0-9]+([.-][0-9a-z]+)*\.[a-z]{1,3}$/
    const testResult = EmailRegex.test(email)
    return testResult;

}


const passwordChecker = (password = "Mern@2305") => {
    const passwordRegex = /"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"/
    const testResult = passwordRegex.test(password)
    return testResult;

}

module.exports = { EamilChecker, passwordChecker }