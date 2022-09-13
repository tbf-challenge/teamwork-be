exports.shorthands = undefined

exports.up = (pgm) => {
	pgm.createType( 'invite_status' , ['active', 'pending'])
	pgm.createTable('user_invites', {
		email: {
			type: 'varchar(100)',
			notNull: true
		},
		status:{
			type : 'invite_status',
			notNull : true,
			default : 'pending'
		}	
	})
}
   
exports.down = false