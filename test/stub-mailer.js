const sinon = require('sinon')
const nodemailer = require('nodemailer')

let transportStub

before(() => {
	global.transport = {
		sendMail: sinon.fake()
	}

	transportStub = sinon.stub(nodemailer, 'createTransport')
		.returns(global.transport)
})

after(() => {
	transportStub.restore()
})