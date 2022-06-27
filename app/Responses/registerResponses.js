const registerResponse = {
    conflictCode:'409',
    conflictMessage:'Already a person with this email exists',
    badRequestCode:'400',
    badRequestMessage:'Password and ConfirmPassword do not match',
    createdCode:'201',
    createdMessage:'User registered'
  }

  module.exports = registerResponse;